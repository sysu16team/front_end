/* eslint-disable */

<template>
    <div class="content-body">
        <div class="content">
            <div class="content-selector-block">
                <div style="margin-left: 15px;">
                    <Breadcrumb>
                        <BreadcrumbItem to="/MainPage/myGroup">默认小组</BreadcrumbItem>
                        <BreadcrumbItem :to="{name: 'defaultGroupDetail', params: {id: team_id, group: group}}">小组详情</BreadcrumbItem>
                        <BreadcrumbItem>{{group.team_name}}</BreadcrumbItem>
                    </Breadcrumb>
                </div>
            </div>

            <Divider></Divider>

            <div class="main-content">
                <div class="left-content">
                    <div class="logo-block">
                        <img class="logo-image" id="logo" :src="group.logo" alt="Group Logo">
                    </div>
                    <div class="group-name">{{group.team_name}}</div>

                    <div class="description-block">
                        <div class="property">小组描述: </div>
                        <div class="inline-block description">
                            <span class="span">{{group.description}}</span>
                        </div>
                    </div>
                    <div class="limit-block">
                        <div class="property">进组权限: </div>
                        <div class="inline-block">{{group.limit == 0 ? '允许所有人' : (group.limit == 1 ? '需要审核' : '禁止所有人')}}</div>
                    </div>
                    <div class="tags-block">
                        <div class="property">小组标签: </div>
                        <div class="tags-list">
                            <Tag type="dot" color="primary" class="tags" v-for="item in group.teamlabels" :key="item.label" :name="item.label">{{ item.label }}</Tag>
                        </div>
                    </div>
                </div>


                <div class="middle-content">
                    <div class="group-task-block">
                        <div class="group-task-title">
                            <span>组内发布的任务</span>
                        </div>
                        <Scroll height="500">
                            <div v-if="taskList.length != 0" class="group-task-list">
                                <div v-for="item in taskList">
                                    <div v-bind:class="{'task-card':true,'task-card-mouseenter': enterid == item.task_id, 'task-card-mouseleave':!(enterid == item.task_id)}"
                                    v-on:mouseenter="enterid = item.task_id" v-on:mouseleave="enterid = 0"  @click="jumpToTaskDetail(item.task_id)">
                                        <div class="task-title">
                                            <span>{{item.title}}</span>
                                        </div>
                                        <div class="task-simpleinfo">
                                            <span>{{item.introduction}} </span>
                                        </div>
                                        <div class="task-profit">
                                            <span>{{item.money}}</span>
                                        </div>
                                        <div class="task-detail">
                                            <span>数量:{{item.max_accepter_numbert}}</span>
                                            <span>发布人: {{item.publisher}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="group-task-title">
                                <span style="font-size: 10pt">该小组还没有任务，赶紧去发布任务吧！</span>
                            </div>
                        </Scroll>
                    </div>
                </div>

                <div class="right-content">

                    <Tabs value="name1">
                        <TabPane label="成员列表" name="name1">
                            <div class="member-list">
                                <Scroll height="330">
                                    <div class="member-item" v-for="item in group.members" v-bind:key="item.username">
                                        <div class="profile pointer" @click="jumpToUserInfoPage(item.username)">
                                            <Avatar :src="item.avatar" size="small"/>
                                        </div>
                                        <div class="member-username">
                                            <span class="username-span">{{item.username}}</span>
                                        </div>
                                    </div>
                                </Scroll>
                            </div>
                        </TabPane>
                        <TabPane label="机构列表" name="name2">
                            <div v-if="organizationsList.length != 0" class="member-list">
                                <Scroll height="330">
                                    <div class="member-item" v-for="item in organizationsList" v-bind:key="item.username">
                                        <div class="profile pointer" @click="jumpToUserInfoPage(item.orgorganizationname)">
                                            <Avatar :src="item.orgorganizationavatar" size="small"/>
                                        </div>
                                        <div class="member-username">
                                            <span class="username-span">{{item.orgorganizationname}}</span>
                                        </div>
                                    </div>
                                </Scroll>
                            </div>
                            <div v-else class="member-list">
                                <Scroll height="330">
                                    <div class="no-organization">无机构</div>
                                </Scroll>
                            </div>

                        </TabPane>
                    </Tabs>
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

            taskList: [],

            organizationsList: [],

            userType: 1,
        };
    },
    methods: {
        getUserInfo() {
            this.$axios.get('api/v1/user/getPersonalInfo')
                .then(msg => {
                    if (msg.data.code == 200) {
                        this.userInfo = msg.data.data;
                        this.userType = this.userInfo.type;
                        let team_id = this.$route.params.id;
                        if (this.userType == 1) {
                            if (team_id > 0 && team_id < 6) {
                                this.getData();
                            } else {
                                this.$Modal.error({
                                    title: '错误',
                                    content: '没有该小组'
                                })
                                this.$router.push({
                                    name: 'mygroup'
                                })
                            }
                        } else {
                            this.$Modal.error({
                                title: '错误',
                                content: '<p>没有权限查看默认小组详情</p>'
                            })
                            this.$router.push({
                                name: 'mygroup'
                            })
                        }
                    }
                })
                .catch(err => {
                    if (err.response.status == 401) {
                        this.$router.push({name: 'login'});
                        this.$Message.error('请登录');
                    }
                });
        },

        getGroupDetail(team_id) {
            let p1 = new Promise((resolve, reject) => {
                this.$axios.get('/api/v1/team/Id?team_id=' + team_id + '&type=1')
                    .then((res) => {
                        if (res.data.code == 200 && res.data.data.length != 0) {
                            let param = {};
                            param['members'] = [];
                            for (let i = 0, len = res.data.data[0].members.length; i < len; i++) {
                                param['members'].push({username: res.data.data[0].members[i]['member_username']});
                            }
                            this.$axios.post('/api/v1/user/getteammembersavatat', param)
                                .then((response) => {
                                    if (response.data.code == 200) {
                                        res.data.data[0].members = [];
                                        for (let i = 0, len = response.data.data.length; i < len; i++) {
                                            res.data.data[0].members.push(response.data.data[i]);
                                        }
                                        this.group = res.data.data[0];
                                        resolve(res);
                                    } else {
                                        reject(response);
                                    }
                                })
                                .catch((error) => {
                                    reject(error);
                                })
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
                this.$axios.get('/api/v1/task?type=all&range=' + team_id + '&username=' + this.userInfo.username)
                    .then((res) => {
                        this.taskList = res.data.data;
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            });

            let p = Promise.all([p1, p2, p3]);

            return p;
        },

        getData() {
            this.team_id = this.$route.params.id;

            this.getGroupDetail(this.team_id)
                .then((data) => {

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

        jumpToUserInfoPage(username) {
            this.$router.push({path: `/user/` + username});
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
    z-index: 999;
    margin: 10px;
}

.main-content {
    display: flex;
    position: relative;
}

.left-content {
    flex: 1 0 25%;
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

.middle-content {
    flex: 1 0 40%;
    margin: 0px 5px;
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

/* .tags {
    display: block;
} */

.group-task-title {
    margin: 10px 30px;
    font-size: 15pt;

}

.task-card {
    position:relative;
    border: 1px solid #2d8cf0;
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
    overflow: hidden;
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
    flex: 1 1 30%;
    margin: 0px 5px;
    padding-left: 50px;
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
}

.hidden {
    display: none;

}

/* .member-item:hover {
    border-top: 1px solid #5cadff;
    border-bottom: 1px solid #5cadff;
} */

.profile {
    display: inline-block;
    height: 30px;
    width: 30px;
}

.pointer:hover {
    cursor: pointer;
}

.member-username {
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
}

.username-span {
    font-size: 12pt;
}

.no-organization {
    text-align: center;
}

/* .group-task-list {
    margin-right: 10px;
} */

</style>
