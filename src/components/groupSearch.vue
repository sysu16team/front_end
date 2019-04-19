/* eslint-disable */

<template>
    <div class="content-body">
        <div class="content">
            <div class="content-selector-block">
                <!-- <div class="selector">
                    <Input v-model="input" placeholder="Search Group">
                        <Select v-model="groupAttribute" slot="prepend" style="width:80px" label="小组ID">
                            <Option v-for="item in groupAttributeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <Button slot="append" icon="ios-search" @click="searchGroup"></Button>
                    </Input>
                </div>
                <div class="selector" >
                    <Cascader style="width: 90%; margin-right: 10px" :data="defaultLabels" v-model="currentTeamLabel" :render-format="cascaderFormat" trigger="hover"></Cascader>
                </div> -->

                <div v-if="groupAttribute != 'group_tag'" class="inputblock">
                    <Input v-model="input" search enter-button placeholder="Search Group" @on-search="searchGroup" />
                </div>
                <div v-else class="inputblock">
                    <Cascader style="width: 90%; margin-right: 10px;margin-top: 5px" :data="defaultLabels" v-model="currentTeamLabel" :render-format="cascaderFormat" trigger="hover" @on-change="searchGroupByTags"></Cascader>
                </div>
                <div>
                   <Button type="primary"  @click="reset()" style="font-size: 12px;float: right;margin-right: 30px;margin-top: 11px" :disabled="isUploading">重置</Button>
                </div>
            </div>

            <Divider>Group</Divider>

            <div v-if="teams.length != 0" class="group-content">
                <div class="div-flex" v-for="item in teams" v-bind:key="item.id">
                    <div class="group-card" @click="getGroupItem(item.team_id)" >
                        <div class="top-block">
                            <div class="applyJoin-block">
                                <Button type="primary" @click="applyJoinGroup(item.team_id)">申请进群</Button>
                          </div>
                            <div class="group-image" style="display: inline">
                                <Avatar :src="item.logo" > U</Avatar>
                            </div>
                            <div class="group-name" style="display: inline">
                                <span>{{item.team_name}}</span>
                            </div>
                        </div>

                        <div class="middle-block">
                            <div class="group-description">
                                <span>{{item.description}}</span>
                            </div>
                        </div>
                        <div class="bottom-block">
                            <div class="group-tags" style="display: inline">
                                <Icon type="md-pricetags" />
                                <Tag type="border" class="tags" v-for="item in item.teamlabels" :key="item.label" :name="item.label">{{ item.label }}</Tag>
                            </div>
                            <div class="group-members" style="display: inline">
                                <Icon type="md-person" />
                                <span>{{item.members.length}}</span>
                            </div>
                        </div>

                        <div class="group-simpleinfo">
                            <span>{{item.simpleinfo}} </span>
                        </div>


                    </div>
                </div>
            </div>
            <div v-else class="group-content">
                <div class="search-result">
                    <span v-if="first">请输入想搜索的小组的条件</span>
                    <span v-else>{{errorMessage}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['userInfo'],
    data() {
        return {
            groupAttributeList: [
                {
                    value: 'group_name',
                    label: '小组名字'
                }
            ],
            groupAttribute: 'group_name',

            errorMessage: '',

            input: '',

            enterid: 0,

            first: true,

            default_teams: [
                {
                    team_id: 1,
                    team_name: 'group1',
                    leader: 'hhyx',
                    logo: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556460005123&di=70167f3e40d02f2764db7079522fc646&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F09%2F11%2F2157d55a32f1e7f.jpg',
                    createAt: '2019-04-28 00:00:00',
                    description: 'This is group1',
                    limit: 0,
                    teamlabels: [
                        {
                            label: '羽毛球'
                        },
                        {
                            label: '足球'
                        }
                    ],
                    members: [
                        {
                            member_username: 'hhyx'
                        },
                        {
                            member_username: 'hzhh'
                        },
                        {
                            member_username: 'HeChX'
                        },
                        {
                            member_username: 'Howlyao'
                        },
                    ],


                },
                {
                    team_id: 2,
                    team_name: 'group2',
                    leader: 'HeChX',
                    logo: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2605489307,3834536344&fm=26&gp=0.jpg',
                    createAt: '2019-04-28 00:00:00',
                    description: 'This is group2',
                    limit: 0,
                    teamlabels: [
                        {
                            label: '乒乓球'
                        }
                    ],
                    members: [
                        {
                            member_username: 'HeChX'
                        },
                        {
                            member_username: 'hzhh'
                        },
                        {
                            member_username: 'Howlyao'
                        },
                    ],

                },
                {
                    team_id: 3,
                    team_name: 'group3',
                    leader: 'hzhh',
                    logo: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556460204895&di=7617f2b558b0aa0fa511b000830eee0f&imgtype=0&src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F02%2F75%2F16%2F5a33804002831_610.jpg',
                    createAt: '2019-04-28 00:00:00',
                    description: 'This is group3',
                    limit: 0,
                    teamlabels: [
                        {
                            label: '羽毛球'
                        }
                    ],
                    members: [
                        {
                            member_username: 'hzhh'
                        },
                        {
                            member_username: 'HeChX'
                        },
                        {
                            member_username: 'Howlyao'
                        },
                        {
                            member_username: 'user1'
                        },
                        {
                            member_username: 'user2'
                        },
                    ],

                },
            ],

            teams: [],

            currentTeamLabel: [],

            showDrawer: -1,

            getGroupURLParams: '',

            defaultLabels: [
                {
                    value: '体育',
                    label: '体育',
                    children: [
                        {
                            value: '足球',
                            label: '足球'
                        },
                        {
                            value: '网球',
                            label: '网球'
                        },
                        {
                            value: '乒乓球',
                            label: '乒乓球'
                        },
                        {
                            value: '篮球',
                            label: '篮球'
                        },
                        {
                            value: '排球',
                            label: '排球'
                        },
                        {
                            value: '游泳',
                            label: '游泳'
                        },
                        {
                            value: '太极',
                            label: '太极'
                        },
                        {
                            value: '龙舟',
                            label: '龙舟'
                        },
                    ]
                },
                {
                    value: '学习',
                    label: '学习',
                    children: [
                        {
                            value: '专业',
                            label: '专业',
                            children: [
                                {
                                    value: '计算机类',
                                    label: '计算机类'
                                },
                                {
                                    value: '软件工程',
                                    label: '软件工程'
                                },
                                {
                                    value: '经济学',
                                    label: '经济学'
                                },
                                {
                                    value: '数学',
                                    label: '数学'
                                },
                                {
                                    value: '其他专业',
                                    label: '其他专业'
                                },
                            ]
                        },
                        {
                            value: '课程',
                            label: '课程',
                            children: [
                                {
                                    value: '高等数学',
                                    label: '高等数学'
                                },
                                {
                                    value: '线性代数',
                                    label: '线性代数'
                                },
                                {
                                    value: '程序设计',
                                    label: '程序设计'
                                },
                                {
                                    value: '计算机网络',
                                    label: '计算机网络'
                                },
                                {
                                    value: '公选',
                                    label: '公选'
                                },
                                {
                                    value: '其他课程',
                                    label: '其他课程'
                                },
                            ]
                        },
                    ]
                },
                {
                    value: '兴趣',
                    label: '兴趣',
                    children: [
                        {
                            value: '吉他',
                            label: '吉他'
                        },
                        {
                            value: '轮滑',
                            label: '轮滑'
                        },
                        {
                            value: '定向越野',
                            label: '定向越野'
                        },
                        {
                            value: '飞镖',
                            label: '飞镖'
                        },
                        {
                            value: '电竞',
                            label: '电竞'
                        },
                        {
                            value: '滑板',
                            label: '滑板'
                        },
                        {
                            value: '自行车',
                            label: '自行车'
                        },
                        {
                            value: '夜跑',
                            label: '夜跑'
                        },
                    ]
                }
            ],
        };
    },
    methods: {
        getUserInfo() {
            this.$axios.get('api/v1/user/getPersonalInfo')
                .then(msg => {
                    if (msg.data.code == 200) {



                    }
                })
                .catch(err => {
                    if (err.response.status == 401) {
                        this.$router.push({name: 'login'});
                        this.$Message.error('请登录');
                    }
                });

                this.searchAllGroup();
                alert(teams.length);
        },

        reset(){
            this.searchAllGroup();
        },

        getGroupItem(id_) {
            if (this.showDrawer != id_) this.showDrawer = id_;
            else this.showDrawer = -1;
        },

        searchGroupByTags(value, selectedData) {
            if (this.groupAttribute == 'group_tag' && selectedData.length != 0) {
                this.input = selectedData[selectedData.length - 1].value;
            }
            this.searchGroup();
        },

        searchAllGroup()
        {
          this.teams=[];
          this.$axios.get('/api/v1/team/All')
           .then((response) => {
                        switch(response.data.code) {
                            case 200:
                                let data = response.data.data;
                                for (let i = 0, len = data.length; i < len; i++) {
                                    this.teams.push(data[i]);
                                };
                                break;
                            case 213:
                                break;
                        }

                    })
                    .catch((error) => {
                        console.log(error);
                    })
        },

        searchGroup() {
            if (this.input != "") {
                if (this.first) this.first = false;

                let searchType = '';

                this.getGroupURLParams = '/Name?team_name=' + this.input; searchType = '小组名字';
                this.errorMessage = '抱歉，没有找到符合条件(小组名字为\'' + this.input + '\')的小组，请确认' + searchType + '是否输入正确';


                let t = this;
                t.teams = [];
                this.$axios.get('/api/v1/team' + this.getGroupURLParams + '&type=0')
                    .then((response) => {
                        switch(response.data.code) {
                            case 200:
                                let data = response.data.data;
                                for (let i = 0, len = data.length; i < len; i++) {
                                    t.teams.push(data[i]);
                                };
                                break;
                            case 213:
                                break;
                        }

                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        },

        applyJoinGroup(id_) {
            let inGroup = false;
            for (let i = 0, len = this.teams.length; i < len; i++) {
                if (id_ == this.teams[i].team_id) {
                    for (let j = 0, len2 = this.teams[i].members.length; j < len2; j++) {
                        if (this.userInfo.username == this.teams[i].members[j].member_username) {
                            inGroup = true;
                            break;
                        }
                    }
                    break;
                }
            }

            let content = '';
            if (!inGroup) {
                this.$axios.post('/api/v1/team/Member/Addition', {team_id: id_})
                    .then((res) => {
                        switch (res.data.code) {
                            case 200:
                                this.$Modal.success({
                                    title: '提示',
                                    content: '<p>申请成功</p><p>你已经成功加入该小组</p>',
                                    onOk: () => {
                                        this.$router.push({name: 'groupDetail', params: {id: id_}});
                                    }
                                });
                                break;
                            case 210:
                                this.$Modal.error({
                                    title: '提示',
                                    content: '<p>申请失败</p><p>用户不存在</p>'
                                });
                                break;
                            case 211:
                                this.$Modal.info({
                                    title: '提示',
                                    content: '<p>你已经在该小组中了</p><p>不能再次加入</P>'
                                });
                                break;
                            case 213:
                                this.$Modal.error({
                                    title: '提示',
                                    content: '<p>申请失败</p><p>小组不存在</p>'
                                });
                                break;
                            case 214:
                                this.$Modal.info({
                                    title: '提示',
                                    content: '<p>申请已发送</p><p>等待小组组长审核</p>'
                                });
                                break;
                            case 215:
                                this.$Modal.info({
                                    title: '提示',
                                    content: '<p>申请失败</p><p>该小组禁止所有人加入</p>'
                                });
                                break;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            } else {
                this.$Modal.info({
                    title: '提示',
                    content: '<p>你已经在该小组中了</p><p>不能再次加入</P>'
                })
            }
        },

        cascaderFormat(labels, selectedData) {
            const index = labels.length - 1;
            return labels[index];
        },

        sendToMainPage() {
            let data = {
                active: '2-1',
                open: '2'
            };
            this.$emit('menuSelected', data);
        },
    },
    mounted: function() {
        this.getUserInfo();
        this.sendToMainPage();
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
    margin: 10px;
}

.inputblock {
    margin: 10px;
    flex: 0 1 35%;
}

.content-selector-block {
    display: flex;
    position:relative;
    z-index: 0;

}

.groupCard {
    position:relative;
    border: 1px solid black;
    border-radius: 30px;
    height: 160px;
    width: 20%;
    margin: 30px;
    float: left;
    box-shadow: 4px 4px 10px grey;
}

.group-content {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    width:100%;

}

.div-flex {
    flex-basis: 25%;
}

.group-card {
    position:relative;
    border: 1px solid black;
    height: 160px;
    width: 90%;
    margin: 15px;
    float: left;
    box-shadow: 4px 4px 10px black;
}


.group-name{
    font-size: 20px;
    margin: 10px;
}

.group-description {
    margin: 0px 5px;
}

.group-simpleinfo {
    font-size: 18px;
    margin:10px;
}


.group-peopleCount {
    position:absolute;
    right:0px;
    bottom:0px;
    margin:10px;

}

.top-block {
    height: 30%;
    overflow: hidden;
}

.middle-block {
    height: 50%;
}

.bottom-block {
    height: 20%;
    position: relative;
}

.group-name {
    vertical-align: middle;
}

.group-tags {
    position: absolute;
    left: 5px;
    bottom: 0px;
}

.tags {
    vertical-align: middle;
}

.group-members {
    position: absolute;
    right: 5px;
    bottom: 5px;
}

.applyJoin-block {
    float:right;
    text-align: center;
}

.search-result {
    margin: auto;
    font-size: 12pt;
}

</style>
