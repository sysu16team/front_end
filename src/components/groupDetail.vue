/* eslint-disable */

<template>
    <div class="content-body">
        <div class="content">
            <div class="content-selector-block">
                <div style="margin-left: 15px;">
                    <Breadcrumb>
                        <BreadcrumbItem to="/MainPage/myGroup">我的小组</BreadcrumbItem>
                        <BreadcrumbItem :to="{name: 'groupDetail', params: {id: team_id, group: group}}">小组详情</BreadcrumbItem>
                        <BreadcrumbItem>{{group.team_name}}</BreadcrumbItem>
                    </Breadcrumb>
                </div>
            </div>

            <Divider></Divider>

            <div class="main-content">
                <div class="left-content">
                    <div class="group-name">{{group.team_name}}</div>

                    <div class="description-block">
                        <div class="property">小组描述: </div>
                        <div class="inline-block description">
                            <span class="span">{{group.description}}</span>
                        </div>
                    </div>
                    <div class="leader-block">
                        <div class="property">组长: </div>
                        <div class="inline-block">{{group.leader}}</div>
                    </div>
                    <div class="limit-block">
                        <div class="property">进群权限: </div>
                        <div class="inline-block">{{group.limit == 0 ? '允许所有人' : (group.limit == 1 ? '需要审核' : '禁止所有人')}}</div>
                    </div>
                    <div class="modify-info">
                        <Button class="button-modify" v-bind:class="{'hidden': !isLeader}" type="info"  :to="{name: 'modifyGroupInfo', params: {id: team_id, group: group}}">修改资料</Button>
                    </div>
                </div>

                <div class="right-content">

                    <Tabs value="name1">
                        <TabPane label="成员列表" name="name1">
                            <div class="member-list">
                                <Scroll :on-reach-bottom="handleReachBottom" height="250">
                                    <div class="member-item" v-for="item in group.members" v-bind:key="item.username">
                                        <div class="profile pointer" @click="jumpToUserInfoPage(item['member_username'])">
                                            <Avatar :src="item.avatar" size="small"/>
                                        </div>
                                        <div class="member-username">
                                            <span class="username-span">{{item['member_username']}}</span>
                                        </div>
                                        <div class="buttonList">
                                            <Button :class="{'hidden': !isLeader}" class="button-blacklist" @click="dislodge(item.username)">移除</Button>
                                        </div>
                                    </div>
                                </Scroll>
                                <div class="withdraw">

                                    <Button v-bind:class="{'withdraw-button': true, 'hidden': !isLeader}" type="primary" long @click="showTransferDrawer=true; selectMember=''">转让该小组</Button>
                                </div>


                            </div>
                        </TabPane>

                    </Tabs>
                    <Button v-bind:class="{'withdraw-button': true, 'hidden': isLeader}" type="error" long @click="withdrawGroup">退出该小组</Button>
                    <Button v-bind:class="{'withdraw-button': true, 'hidden': !isLeader}" type="error" long @click="dissolveGroup">解散该小组</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // props: ['userInfo'],

    data() {
        return {
            userInfo: {},
            team_id: '',

            group: {
                team_name: '',
                leader: '',
                logo: '',
                description: '',
                limit: '',
                teamlabels: [{}],
                members: [{}]
            },

            enterid: 0,
            enterUser: '',

            isLeader: true,

            showDrawer: false,
            showTransferDrawer: false,

            taskList: [],

            organizationsList: [],

            currentInvitedMember: '',

            inviteList: [],

            showTaskDrawer: -1,
        };
    },
    methods: {
        getUserInfo() {
            this.$axios.get('api/v1/user/getPersonalInfo')
                .then(msg => {
                    if (msg.data.code == 200) {
                        this.userInfo = msg.data.data;
                            this.userRender();
                    }
                })
                .catch(err => {
                    if (err.response.status == 401) {
                        this.$router.push({name: 'login'});
                        this.$Message.error('请登录');
                    }
                });
        },

        judge(team_id) {
            let p = new Promise((resolve, reject) => {
                this.$axios.get('/api/v1/team/Member?team_id=' + team_id)
                    .then((res) => {
                        if (res.data.code == 200) {
                            resolve(team_id);
                        } else if (res.data.code == 213) {
                            reject(213);
                        } else if (res.data.code == 211) {
                            reject(211);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })

            return p;
        },

        orgJudge(team_id) {
            let p = new Promise((resolve, reject) => {
                this.$axios.get('/api/v1/team/OrgMember?team_id=' + team_id)
                    .then((res) => {
                        if (res.data.code == 200) {
                            resolve(team_id);
                        } else if (res.data.code == 213) {
                            reject(213);
                        } else if (res.data.code == 211) {
                            reject(211);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })

            return p;
        },

        getGroupDetail(team_id) {

            let p1 = new Promise((resolve, reject) => {
                this.$axios.get('/api/v1/team/Id?team_id=' + team_id + '&type=0')
                    .then((res) => {
                        if (res.data.code == 200 && res.data.data.length != 0) {
                            let param = {};
                            param['members'] = [];
                            for (let i = 0, len = res.data.data[0].members.length; i < len; i++) {
                                param['members'].push({username: res.data.data[0].members[i]['member_username']});
                            }
                            this.group = res.data.data[0];

                        } else {
                            reject(res);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    })
            });

            let p2 = new Promise((resolve, reject) => {
                this.$axios.get('/api/v1/user/getCanPublishTasksOrg?teamId=' + team_id)
                    .then((res) => {
                        this.organizationsList = res.data.data;
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    })

            });

            let p3 = new Promise((resolve, reject) => {
                this.$axios.get('/api/v1/team/Leader?team_id=' + team_id + '&leader=' + this.userInfo.username)
                    .then((res) => {
                        if (res.data.code == 200) {
                            this.isLeader = true;
                        } else if (res.data.code == 212) {
                            this.isLeader = false;
                        }
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            });

            let p4 = new Promise((resolve, reject) => {
                this.$axios.get('/api/v1/task?type=all&range=' + team_id + '&username=' + this.userInfo.username)
                    .then((res) => {
                        this.taskList = res.data.data;
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            });

            let p = Promise.all([p1, p2, p3, p4]);

            return p;
        },

        handleClose(event, name) {
            const index = this.inviteList.indexOf(name);
            this.inviteList.splice(index, 1);
        },

        getTaskItem(id_) {
            if (this.showTaskDrawer != id_) this.showTaskDrawer = id_;
            else this.showTaskDrawer = -1;
        },

        jumpToTaskDetail(id_) {
            this.$router.push({
                name: 'task_detail',
                params: {
                    id:id_
                }
            });

        },

        jumpToUserInfoPage(username) {
            this.$router.push({path: `/user/` + username});
        },

        dislodge(username) {
            if (this.isLeader) {
                if (this.userInfo.username != username) {
                    this.$Modal.confirm({
                        title: '确认',
                        content: '<p>是否确认移出用户' + username + '</p>',
                        onOk: () => {
                            let param = {team_id: this.team_id, username: username};
                            this.$axios.delete('/api/v1/team/Member/Dislodge', {params: param})
                                .then((res) => {
                                    for (let i = 0, len = this.group.members.length; i < len; i++) {
                                        if (username == this.group.members[i]['username']) {
                                            this.group.members.splice(i, 1);
                                        }
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                        }
                    })
                } else {
                    this.$Modal.info({
                        title: '提示',
                        content: '不能移除自己'
                    })
                }

            }
        },
        selectMember(username) {
            this.selectMember = username;
        },

        transferMembersComplete(username) {
            if (username != '' && this.isLeader) {
                if (this.userInfo.username != username) {
                    this.$Modal.confirm({
                        title: '确认',
                        content: '<p>是否确认将该小组组长转让给' + username + '</p>',
                        onOk: () => {
                            this.$axios.post('/api/v1/team/Leader', {team_id: this.team_id, username: username})
                                .then((res) => {
                                    this.group.leader = username;
                                    this.isLeader = false;
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                        }
                    })

                } else {
                    this.$Modal.warning({
                        title: '提示',
                        content: '<p>不能转让给自己</p>'
                    })
                }
                this.showTransferDrawer = false;
            } else if (username == '') {

            }
        },

        handleReachBottom() {

        },

        withdrawGroup() {
            if (!this.isOrg && !this.isLeader) {
                this.$Modal.confirm({
                    title: '确认',
                    content: '<p>确认退出该小组？</p>',
                    onOk: () => {
                        let param = {team_id: this.team_id};
                        this.$axios.delete('/api/v1/team/Member/Departure', {params: param})
                            .then((res) => {
                                if (res.data.code == 200) {
                                    this.$router.push({
                                        name: 'mygroup'
                                    })
                                }
                                console.log(res);
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                    }
                })
            } else if (this.isOrg) {
                this.$axios.post('/api/v1/user/orgquitteam', {team_id: this.team_id})
                    .then((res) => {
                        console.log(res);
                        if (res.data.code == 200) {
                            this.$Modal.info({
                                title: '提示',
                                content: '<p>退出成功</p>'
                            });
                            this.$router.push({
                                name: 'mygroup'
                            })
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        },

        dissolveGroup() {
            if (this.isLeader) {
                this.$Modal.confirm({
                    title: '确认',
                    content: '<p>是否确认解散该小组？</p><p>（解散后不可恢复！）</p>',
                    onOk: () => {
                        let param = {team_id: this.team_id};
                        this.$axios.delete('/api/v1/team', {params: param})
                            .then((res) => {
                                if (res.data.code == 200) {
                                    this.$router.push({
                                        name: 'mygroup'
                                    })
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                    }
                })
            }
        },

        userRender() {
            this.team_id = this.$route.params.id;

            this.judge(this.team_id)
                .then((data) => {
                    this.getGroupDetail(data)
                })
                .catch((err) => {
                    if (err == 213) {
                        this.$Modal.error({
                            title: '错误',
                            content: '没有该小组'
                        })
                        this.$router.push({
                            name: 'mygroup'
                        })
                    } else if (err == 211) {
                        this.$Modal.error({
                            title: '错误',
                            content: '<p>你不是该小组成员</p><p>无法查看该小组详情</p>'
                        })
                        this.$router.push({
                            name: 'mygroup'
                        })
                    }
                })
        },


        sendToMainPage() {
            let data = {
                active: '2-2',
                open: '2'
            };
            this.$emit('menuSelected', data);
        },
    },

    mounted: function() {
        this.getUserInfo();
        this.sendToMainPage();
    },

    watch: {
        '$route.params': 'switchGroup'
    }


}
</script>

<style scoped>
span {
    margin:3px;
}

.content {
    background:#fffff0;
    padding:15px;
}

.selector {
    position: relative;
    margin: 10px;
    width: 25%;
}

.content-selector-block {
    position:relative;
    width: 1200px;
    margin: 10px;
}

.main-content {
    display: flex;
    position: relative;
}

.left-content {
    flex: 0 1 45%;
    margin: 0px 5px;
}

.logo-block {
    width: 200px;
    height: 200px;
    margin: auto;
}

.group-name {
    margin: 10px auto;
    text-align: center;
    font-size: 15pt;
    width: 200px;
}

.logo-image {
    width: 100%;
    height: 100%;
    border-radius: 5px;
}

.modify-info {
    margin: 10px auto;
    text-align: center;
}

.button-modify {
    margin: auto;
}


.property {
    display: inline-block;
    width: 30%;
    font-size: 12pt;
    margin: 5px;
}

.description {
    border: 1px solid #dcdee2;
    border-radius: 5px;
    background-color: #ffffff;
    height: 96px;
    font-size: 10pt;
    padding: 5px;
    width: 60%;
    vertical-align: top;
}

.span {
    font-size: 10pt;
}

.inline-block {
    display: inline-block;
}

.tags-list {
    display: inline-block;
    vertical-align: top;
}

.group-task-title {
    margin: 10px 30px;
    font-size: 15pt;

}

.task-card {
    position:relative;
    border: 1px solid #000000;
    border-radius: 10px;
    height: 120px;
    width: 90%;
    margin: 10px 30px;
    float: left;
}

.task-card:hover {
    cursor: pointer;
}

.task-card-mouseenter {
    box-shadow: 4px 4px 10px #2b85e4;
}

.task-card-mouseleave {
    box-shadow: 4px 4px 10px #5cadff;
}

.task-title {
    font-size: 20px;
    margin: 10px;
}

.task-simpleinfo {
    font-size: 16px;
    margin:10px;
}

.task-profit {
    font-size: 12px;
    position:absolute;
    bottom: 0px;
    left: 0px;
    margin: 10px;

}

.task-detail {
    position:absolute;
    right:0px;
    bottom:0px;
    margin:10px;

}

.right-content {
    flex: 0 0 45%;
    width: 45%;
    margin: 0px 5px;
    padding-left: 30px;
    padding-right: 10px;
}

.member-list {
    background-color: #ffffff;
    padding: 5px;
    position: relative;
}

.member-item {
    height: 30px;
    margin: 5px 0px;
    display: flex;
    overflow: hidden;
}

.hidden {
    display: none;

}

.profile {
    height: 30px;
    width: 30px;
    flex: 0 1 10%;
}

.pointer:hover {
    cursor: pointer;
}

.member-username {
    display: inline-block;
    vertical-align: middle;
    margin: auto;
    overflow: hidden;
    flex: 0 1 50%;
}

.member-username-choosebox {
    display: inline-block;
    vertical-align: middle;
    margin: auto;
    overflow: hidden;
    flex: 0 1 90%;
}

.buttonList {
    flex: 0 1 40%;
    display: flex;
    justify-content: flex-end;
}

.username-span {
    font-size: 12pt;
}

.button-blacklist {
    padding: 3px 15px;
    margin: 1.5px 3px;
}

.withdraw {
    margin-top: 20px;
}

.withdraw-button {
    margin-top: 10px;
}

.invite-button {
    margin: 5px 0;
}

.user-item-mouseenter {
    background-color: #fffff0;
    cursor: pointer;
}

.user-item-mouseleave {
    background-color: #ffffff;
}

.user-item-selected {
    background-color: #5cadff;
}

.transfer-complete {
    margin-top: 20px;
}

.no-organization {
    text-align: center;
}

</style>
