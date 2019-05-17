/* eslint-disable */

<template>
    <div class="content-body">
        <div v-bind:class="{'hidden': userType}" class="content">
            <div class="content-selector-block">
                <div style="margin-left: 900px;">
                    <Breadcrumb>
                        <BreadcrumbItem  to="/MainPage/myGroup">我的小组</BreadcrumbItem>
                    </Breadcrumb>
                </div>
            </div>

            <Divider></Divider>

            <div v-if="teams.length != 0" class="group-content">
                <div class="div-flex" v-for="item in teams" v-bind:key="item.team_id">
                    <div v-bind:class="{'group-card':true,'group-card-mouseenter': enterid == item.team_id, 'group-card-mouseleave':!(enterid == item.team_id)}"
                    v-on:mouseenter="enterid = item.team_id" v-on:mouseleave="enterid = 0" @click="jumpToGroupDetail(item)" >
                        <div class="top-block">
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
                                <Tag type="border" class="tags" v-for="item in item.teamlabels" :key="item.id" :name="item.label">{{ item.label }}</Tag>
                            </div>
                            <div class="group-members" style="display: inline">
                                <Icon type="md-person" />
                                <span>{{item.members.length}}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div v-else class="group-content">
                <div class="no-group">
                    你还没有加入小组，赶紧去加入吧！
                </div>
            </div>
        </div>

        <div v-bind:class="{'hidden': !userType}" class="tab-content">
            <Tabs :value="tabValue">
                <TabPane label="我的小组" name="tabMyGroup">
                    <div v-if="teams.length != 0" class="group-content">
                        <div class="div-flex" v-for="item in teams" v-bind:key="item.team_id">
                            <div v-bind:class="{'group-card':true,'group-card-mouseenter': enterid == item.team_id, 'group-card-mouseleave':!(enterid == item.team_id)}"
                             @click="jumpToGroupDetail(item)" >
                                <div class="top-block">
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
                                        <Tag type="border" class="tags" v-for="item in item.teamlabels" :key="item.id" :name="item.label">{{ item.label }}</Tag>
                                    </div>
                                    <div class="group-members" style="display: inline">
                                        <Icon type="md-person" />
                                        <span>{{item.members.length}}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div v-else class="group-content">
                        <div class="no-group">
                            你还没有加入小组，赶紧去加入吧！
                        </div>
                    </div>
                </TabPane>
                <TabPane label="默认小组" name="tabDefaultGroup">
                    <div class="group-content">
                        <div class="div-flex" v-for="item in defaultGroupList" v-bind:key="item.team_id">
                            <div class="group-card" @click="jumpToDefaultGroupDetail(item)" >
                                <div class="top-block">
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
                                        <Tag type="border" class="tags" v-for="item in item.teamlabels" :key="item.id" :name="item.label">{{ item.label }}</Tag>
                                    </div>
                                    <div class="group-members" style="display: inline">
                                        <Icon type="md-person" />
                                        <span>{{item.members.length}}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </TabPane>
            </Tabs>


        </div>
    </div>
</template>

<script>
export default {
    // props: ['userInfo'],
    data() {
        return {
            userInfo: {},

            groupAttributeList: [
                {
                    value: 'group_id,',
                    label: '小组ID'
                },
                {
                    value: 'group_name',
                    label: '小组名字'
                },
                {
                    value: 'group_tag',
                    label: '小组标签'
                }
            ],
            groupAttribute: '',

            enterid: 0,
            defaultTeams: [
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
                            member_username: 'GZQ'
                        },
                        {
                            member_username: 'Huang-Junjie'
                        },
                    ],

                },
            ],

            teams: [

            ],

            defaultGroupList: [],

            tags: ['sport', 'music'],

            userType: 0,

            tabValue: 'tabMyGroup',
        };
    },
    methods: {
        getUserInfo() {
            this.$axios.get('api/v1/user/getPersonalInfo')
                .then(msg => {
                    if (msg.data.code == 200) {
                        this.userInfo = msg.data.data;
                        this.userType = this.userInfo.type;
                        if (this.userType) {
                            this.getAllGroupJoinedByOrg();
                            this.getDefaultGroup();
                        } else {
                            this.getAllGroupJoined();
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

        getAllGroupJoined() {
            let t = this;
            t.teams = [];
            t.$axios.get('/api/v1/team/MemberName?type=0')
                .then(function (response) {
                    if (response.data.code == 200) {
                        let data = response.data.data;
                        for (let i = 0, len = data.length; i < len; i++) {
                            t.teams.push(data[i]);
                        }
                    }
                })
                .catch(function(error) {
                    console.log(error)
                })
        },

        getAllGroupJoinedByOrg() {
            this.teams = [];
            this.$axios.get('/api/v1/team/OrgName?type=0')
                .then((res) => {
                    if (res.data.code == 200) {
                        for (let i = 0, len = res.data.data.length; i < len; i++) {
                            this.teams.push(res.data.data[i]);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },

        getDefaultGroup() {
            this.$axios.get('/api/v1/team/DefaultGroup')
                .then((res) => {
                    if (res.data.code == 200) {
                        for (let i = 0, len = res.data.data.length; i < len; i++) {
                            this.defaultGroupList.push(res.data.data[i]);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },

        jumpToGroupDetail: function(item) {
            this.$router.push({name: 'groupDetail', params: {id: item.team_id, group: item}})
        },

        jumpToDefaultGroupDetail(item) {
            this.$router.push({name: 'defaultGroupDetail', params: {id: item.team_id, group: item}})
        },

        sendToMainPage() {
            let data = {
                active: '2-2',
                open: '2'
            };
            this.$emit('menuSelected', data);
        }

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
    position: relative;
    margin: 10px;
    width: 25%;
}

.content-selector-block {
    position:relative;
    z-index: 999;
    margin: 10px;
    width: 1200px;
}

.title {
    margin: auto 15px;
    font-size: 13pt;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bolder;
    height: 30px;
    line-height: 30px;
}

.button-create {
    position: absolute;
    right: 3%;
    top: 1%;
}

.group-content {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    width:100%;
}

.div-flex {
    flex-basis: 50%;
}

.group-card {
    position:relative;
    border: 1px solid #black;
    height: 160px;
    width: 45%;
    margin: 30px;
    float: left;
    box-shadow: 4px 4px 10px black;
}


.group-name{
    font-size: 24px;
    margin: 10px;
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
    margin: 5px;
}

.middle-block {
    height: 35%;
    margin: 10px;
}

.bottom-block {
    height: 20%;
    position: relative;
    margin: 5px;
}

.group-name {
    vertical-align: middle;
}

.group-description {
    font-size: 12pt;
}

.group-tags {
    position: absolute;
    left: 0px;
    bottom: 5px;
}

.tags {
    vertical-align: middle;
}

.group-members {
    position: absolute;
    right: 5px;
    bottom: 5px;
}

.no-group {
    margin: auto;
    font-size: 12pt;
}

.tab-content {
    padding: 15px;
}

.hidden {
    display: none;
}

</style>
