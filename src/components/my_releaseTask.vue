<template>
    <div class="task-body">
        <div class="content" >
            <div class="content-selector-block">
                <div class="div-selectors">
                    <div class="selector">
                        <span class="selector-span">任务类型</span>
                        <Select v-model="typeSelect" style="width:100px;margin-right:5px" @on-change="getReleaseTask(typeSelect,rangeSelect,stateSelect,kindSelect)">
                            <Option v-for="item in taskType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                    <!--
                    <div class="selector">
                        <span class="selector-span">任务发布范围</span>
                        <Select v-model="rangeSelect" style="width:100px;margin-right:5px" @on-change="getReleaseTask(typeSelect,rangeSelect,stateSelect)">

                            <OptionGroup label="全部">
                                <Option v-for="item in allRangeType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </OptionGroup>
                            <OptionGroup label="小组">
                                <Option v-for="item in groupRangeType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                             </OptionGroup>
                             <OptionGroup label="机构">
                                <Option v-for="item in organRangeType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                             </OptionGroup>
                        </Select>
                    </div>
                    -->
                    <div class="selector">
                    <span class="selector-span">任务状态</span>
                        <Select v-model="stateSelect" style="width:100px;margin-right:5px" @on-change="getReleaseTask(typeSelect,rangeSelect,stateSelect,kindSelect)">
                            <Option v-for="item in stateType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                </div>

            </div>
            <Divider></Divider>
            <div class="task-content">
               <div v-for="item in taskItems">
                    <div class="taskCard" @click="jumpToTaskDetail(item.task_id)" v-if="item.state != '未接受'">
                        <div class="taskInfo">
                            <span style="font-weight: bold">任务类型:</span>
                            <span>{{item.type}} </span>
                        </div>
                        <div class="taskTitle">
                            <span>{{item.title}}</span>
                        </div>
                        <div class="taskInfo">
                            <span style="font-weight: bold">任务金额:</span>
                            <span >{{item.money}}</span>
                        </div>
                        <div class="taskIntro">
                            <span>{{item.introduction}} </span>
                        </div>

                    </div>
                </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script scoped>
export default {
    inject: ['backTop'],
    data() {
        return {
            username: null,
            type:0,
            taskType: [
                {
                    value: 'all',
                    label: '全部'
                },
                {
                    value: 1,
                    label: '问卷调查'
                },
                {
                    value: 2,
                    label: '跑腿'
                }
            ],
            allRangeType:[
                {
                    value: 1,
                    label: '公有'
                }
            ],
            groupRangeType: [


            ],
            organRangeType:[

            ],
            stateType: [
                {
                    value: 'all',
                    label: '全部'
                },
                {
                    value: 0,
                    label: '正在做'
                },
                {
                    value: 1,
                    label: '等待核实'
                },
                {
                    value: 3,
                    label: '已完成'
                },
                {
                    value: 4,
                    label: '已过期'
                },
            ],
            typeSelect: 'all',
            rangeSelect: 1,
            stateSelect:'all',
            rangeLabel: '',
            kindSelect: 0,
            enterItemId: '',
            isDrawerDisplay: false,
            taskItems: [

            ],
            groupItems:[],
            defaultGroupItems:[],
            showGroup:true,
            showDefault: false,



        }


    },

    mounted() {
        this.backTop();
        //http.get my release task
        //this.getReleaseTask(this.typeSelect, this.rangeSelect, this.stateSelect);
        this.getUserInfo();
        this.sendToMainPage();
    },

    methods: {
        isComplete(state) {
            return state == 3;
        },

        isWaiting (state) {
            return state == 1;
        },
        isOvertime(state) {
            return state == 4;
        },
        isEnter(id) {
            return id == this.enterItemId;
        },
        getUserInfo(){
            let vm = this;
            let url = '/api/v1/user/getPersonalInfo'
            this.$axios.get(url, {

            })
            .then(function(response) {
                let data = response.data;
                if (data.code == 200) {
                    let userInfo = data.data;
                    vm.username = userInfo.username;
                    vm.type = userInfo.type;

                    vm.getGroup(0);
                    vm.getGroup(1);
                    if (vm.type == 1) {
                        vm.kindSelect = 1;
                        vm.rangeSelect = vm.username;
                        vm.selectOrg();
                    }  else {
                        vm.kindSelect = 0;
                        vm.selectGroup('',1);
                    }
                    // vm.getReleaseTask(vm.typeSelect, vm.rangeSelect, vm.stateSelect, vm.kindSelect);
                }

            })
            .catch(function (error) {
                if (error.response.status == 401) {
                    vm.$Notice.warning({
                        title: 'Login',
                        desc:  "Please Login first"
                    });
                    vm.$router.push({name: 'login'});
                }
            });
        },
        getGroup(type) {
            // console.log("test");
            let vm = this;
            let url = '';
            if (vm.type == 0) {
                url = '/api/v1/team/MemberName';
            } else if (vm.type == 1) {
                url = '/api/v1/team/OrgName';
            }
            //异步
            this.$axios.get(url, {
               params: {
                   type: type,
                   member_username : vm.username
               }

            })
            .then(function(response) {
                let data = response.data;
                if (data.code == 200 ) {


                    let teamDatas = data.data;
                    for(let i = 0;i < teamDatas.length;i ++) {

                        vm.groupRangeType.push({value: teamDatas[i].team_id, label: teamDatas[i].team_name + '--' + teamDatas[i].leader});
                    }

                    if (type == 0) {
                        vm.groupItems = teamDatas;
                    } else if (type == 1) {
                        vm.defaultGroupItems = teamDatas;
                    }



                    // console.log(vm.rangeType);
                }

            })
            .catch(function (error) {
                console.log('Fail to request');
            });
        },
        getReleaseTask(typeSelect, rangeSelect, stateSelect, kindSelect) {
           if(kindSelect == 0) {
               this.getReleaseTaskByGroup(typeSelect, rangeSelect,stateSelect)
           } else if (kindSelect == 1) {

               this.getReleaseTaskByOrg(typeSelect, rangeSelect, stateSelect);
           }

        },
        getReleaseTaskByGroup(typeSelect, rangeSelect, stateSelect) {
             //http request get
            let vm = this;
            let url = '/api/v1/task/findByPublisher';
            //异步

            let flag = false;
            if (stateSelect == 1 || stateSelect == 'all' || stateSelect == 4) {

                flag = true;
                if (stateSelect != 4 ) {
                     stateSelect = 'all'
                }
            }
            this.$axios.get(url, {
                params: {
                    type: typeSelect,
                    range: rangeSelect,
                    state: stateSelect,
                    publisher: vm.username
                }

            })
            .then(function(response) {

                let data = response.data;
                // console.log(data);
                if (data.code == 200) {
                    let taskItems = data.data;
                    for (let i = 0;i < taskItems.length;i ++) {
                        if (taskItems[i].type == 1) {
                            taskItems[i].type = '问卷调查';
                        } else if (taskItems[i].type == 2){
                            taskItems[i].type = '跑腿';
                        }

                        if (flag) {
                            if (taskItems[i].state == 1 || taskItems[i].state == 4) {
                                let trs = taskItems[i].trs;
                                for (let j = 0;j < trs.length;j ++) {
                                    if (trs[j].state == 1) {
                                        taskItems[i].state = 1;
                                        break;
                                    } else if (taskItems[i].state != 4){
                                        taskItems[i].state = 0;
                                    }
                                }
                            }

                        }

                    }

                    vm.taskItems = taskItems;
                }



            })
            .catch(function (error) {
                console.log('error');
            });
        },
        getReleaseTaskByOrg(typeSelect,rangeSelect,stateSelect) {
            let vm = this;
            let url = '/api/v1/task/findByOrg';

            let flag = true;

            this.$axios.get(url, {
                params: {
                    type: typeSelect,
                    // range: rangeSelect,
                    // state: stateSelect,
                    orgname: rangeSelect
                }

            })
            .then(function(response) {

                let data = response.data;
                // console.log(data);
                if (data.code == 200) {
                    // console.log(data.data);
                    let taskItems = data.data;
                    for (let i = 0;i < taskItems.length;i ++) {
                        if (taskItems[i].type == 1) {
                            taskItems[i].type = '问卷调查';
                        } else if (taskItems[i].type == 2){
                            taskItems[i].type = '跑腿';
                        }

                        if (flag) {
                            if (taskItems[i].state == 1 || taskItems.state == 4) {
                                let trs = taskItems[i].trs;
                                for (let j = 0;j < trs.length;j ++) {
                                    if (trs[j].state == 1) {
                                        taskItems[i].state = 1;
                                        break;
                                    } else if (taskItems[i].state != 4) {

                                        taskItems[i].state = 0;
                                    }
                                }
                            }
                        }

                    }

                    vm.taskItems = taskItems;
                }



            })
            .catch(function (error) {
                console.log('error');
            });

        },

        jumpToTaskDetail(id) {
            this.$router.push({path: `/MainPage/task_detail/${id}`})
        },
        isShow(stateSelect, state) {
            if (stateSelect != 'all') {
                return state == stateSelect;
            }
            return true;
        },
        sendToMainPage() {
            let data = {
                active: '1-3-2',
                open: '1-3'
            };
            this.$emit('menuSelected', data);
        },
        selectGroup(team_name,team_id){
            this.kindSelect = 0;
            this.rangeSelect = team_id;
            if(team_id == 1)  {
                this.rangeLabel = '公有';
            } else {
                this.rangeLabel = '小组: ' + team_name;
            }

            this.getReleaseTask(this.typeSelect, this.rangeSelect, this.stateSelect, this.kindSelect);
        },

        selectOrg(){
            this.kindSelect = 1;
            this.rangeSelect = this.username;
            this.rangeLabel= '本机构'
            this.getReleaseTask(this.typeSelect, this.rangeSelect,this.stateSelect, this.kindSelect);
        },
        // setShowGroup(showGroup) {

        //     if(this.type == 1) {
        //         this.getReleaseTaskByOrg(this.username);
        //     } else if (this.type == 0) {
        //         this.showGroup = showGroup;
        //     }
        // }
    }

}

</script>


<style scoped>
div {
    text-align: left;

}


h2 {

}

.task-body {
    padding: 20px;
    position:relative;
    min-width: 960px;
    min-height: 1000px;
    overflow: hidden;
    background-color: #fffff0;
}

.content-selector-block {
    position:relative;
    margin-bottom: 10px;
    padding-left: 10px;
}

.div-selectors {
    position:relative;
    display:flex;
}


.selector {
    position:relative;
    margin-right: 30px;

}

.selector-span {
    margin-right: 15px;

}


.state-type-hint {
    position: relative;
    top: 10px;
}

.div-box {
    display: flex;
    margin-top: 10px;
    margin-right: 10px;
}
.box {
    width:15px;
    height:15px;
    border-radius: 2px;
    margin-right: 5px;
    box-shadow: 2px 2px 2px #c5c8ce;
}

.green-state-box {
    background: #19ff6b;


}

.yellow-state-box {
    background: #ffcc00;

}

.blue-state-box {
    background: #5cadff;
}

.gray-state-box {
    background: #999999;
}

.task-content {
    position: relative;
    width: 100%;
    min-width: 800px;
    height: 100%;
}

.taskCard {
    position:relative;
    border: 1px solid black;
    border-radius: 30px;
    height: 160px;
    width: 20%;
    margin: 30px;
    float: left;
    box-shadow: 4px 4px 10px grey;
}

.taskTitle{
    font-size: 24px;
    margin-top:10px;
    margin-left:10px;
}

.taskIntro {
    font-size: 18px;
    margin:10px;
}

.taskInfo {
    font-size: 14px;
    margin-top:10px;
    margin-right:10px;
    float: right;
}


.taskState {
    font-size: 18px;
    margin-top:30px;
    margin-left:10px;
}

.task-item {
    margin: 20px;
    border: 1px solid #5cadff;
    box-shadow: 5px 5px 5px #5cadff;
    float: left;
    width:28%;
    height: 160px;
    position:relative;
}

.avatar {
    position: absolute;
    bottom: 0px;
    right:0px;
    margin:5px 5px 5px 5px;
    margin-right:10px;
}

.task-type {
    font-size: 14px;
    margin:10px;
}

.task-endtime {
    font-size: 14px;
    margin:10px;
}


.task-money {
    font-size: 12px;
    position:absolute;
    bottom: 0px;
    left: 0px;
    margin: 5px;
    margin-left: 10px;

}

.span-money{
    position:relative;
    bottom: 4px;
}

.coin {
    width:20px;
    height:20px;

}

.task-number {
    position:absolute;
    right:0px;
    bottom:0px;
    margin:10px;

}



.item-mouseenter {
    box-shadow: 3px 3px 5px #2b85e4;
}

.completed {
    border: 1px solid #19be6b;
    box-shadow: 5px 5px 5px #19ff6b;

}

.completed-mouseenter {
    box-shadow: 3px 3px 5px #19be6b;
}

.waiting {
    border: 1px solid #ffcc00;
    box-shadow: 5px 5px 5px #ffcc00;

}

.waiting-mouseenter {
    box-shadow: 3px 3px 5px #ff9900;
}

.overtime {
    border: 1px solid #999999;
    box-shadow: 5px 5px 5px #999999;
}

.overtime-mouseenter {
    box-shadow: 3px 3px 5px #555555;
}

.drawer-body {
    position:relative;
    width: 100%;

}

.div-group-body {
    position:relative;
    margin-top: 10px;


}

.div-group {
    position:relative;
    border: 1px solid #2d8cf0;
    box-shadow: 4px 4px 10px #2b85e4;
    height: 140px;
    width: 140px;
    margin: 20px;
    float: left;
    cursor: pointer;
    text-align: center;
    padding: 4px
}

.div-organization {
    position:relative;
    border: 1px solid #2d8cf0;
    box-shadow: 4px 4px 10px #19ff6b;
    height: 140px;
    width: 140px;
    margin: 20px;
    float: left;
    cursor: pointer;
    text-align: center;
    padding: 4px
}

.logo {
    width: 100px;
    height: 100px;
    position:relative;
    margin:0 auto;

}

</style>
