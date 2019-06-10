/* eslint-disable */

<style scoped>
.task-body {
    padding: 20px;
    position:relative;
    min-width: 800px;
    min-height: 1000px;
    overflow: hidden;
    background-color: #fffff0;
}

.content {
    background:#fffff0;

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

.taskContent {
    position: relative;
    width:100%;

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

.span-money{
    position:relative;
    bottom: 4px;
}

.avatar {
    position: absolute;
    bottom: 0px;
    right:0px;
    margin:5px 5px 5px 5px;4
    margin-right:10px;
}

.drawer-body {
    position:relative;
    width: 100%;

}

.div-group-body {
    position:relative;
    margin-top: 10px;


}

.div-group{
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



<template>
    <div class="task-body">
        <div class="content">
            <div class="content-selector-block">
                <div class="div-selectors" style="z-index:">
                    <div class="selector">
                        <span class="selector-span">任务类型</span>
                        <Select v-model="typeSelect" style="width:100px;margin-right:5px" @on-change="getTasks(typeSelect,rangeSelect,kindSelect)">
                            <Option v-for="item in taskType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                </div>
            </div>
            <Divider></Divider>
            <div class="taskContent">
                <div v-for="item in taskItems">
                    <div class="taskCard" @click="jumpToTaskDetail(item.task_id)" v-show="item.state != '未接受' && flag">
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
                        <div class="taskState">
                            <span>{{item.state}} </span>
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
            type: 0,
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
            typeSelect: 'all',
            rangeSelect: 1,
            tasktitile:'',
            rangeLabel: '公有',
            kindSelect:0,
            enterItemId: '',
            taskState:'',
            flag: false,
            taskItems: [

            ],
            groupItems:[],
            defaultGroupItems:[],
            organsItems:[],
            showGroup:true,
            showDefault: false,

        };
    },

    mounted() {
        this.getUserInfo();
        this.backTop();
        this.sendToMainPage();

    },

    methods: {

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
                    vm.getTasks(vm.typeSelect, vm.rangeSelect, vm.kindSelect);
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

        getTasks(typeSelect, rangeSelect, kindSelect) {

            let vm = this;
            let url = '/api/v1/task';
            this.$axios.get(url, {
               params: {
                   type: typeSelect,
                   range: rangeSelect,
                   username: vm.username
               }

            })
            .then(function(response) {

                let data = response.data;
                if (data.code == 200) {

                    console.log(data.data);
                    let tasks = data.data;
                    if(tasks.length == 0) {
                        vm.$Message.info('This range has no tasks');

                    }
                    vm.taskItems = [];
                    for (let i = 0;i < tasks.length;i ++) {

                        if (tasks[i].type == 1) {
                            tasks[i].type = '问卷调查';
                        } else if (tasks[i].type == 2){
                            tasks[i].type = '跑腿';
                        }
                        vm.getTrs(tasks[i].task_id,i);
                        vm.taskItems.push(tasks[i]);
                    }
                }

            })
            .catch(function (error) {

            });


        },

        getTrs(taskid,i){
            let vm = this;
            let url = '/api/v1/task/acceptance'
                this.$axios.get(url, {
                    params:{
                        task_id: taskid,
                        username: vm.username
                    }
                })
                .then(function(response) {

                    let tr = response.data.data;
                    let tS = '';
                    if (tr == null) {
                        tS = '未接受';
                        vm.getTaskState(tS,i);
                    } else {
                        vm.tr = tr;
                        if (vm.tr.state == 1) {
                            tS = '待确认';
                        } else if (vm.tr.state == 2) {
                            tS = '已完成';
                        } else{
                            tS = '进行中';
                        }
                        vm.getTaskState(tS,i);
                    }
                })
                .catch(function (error) {
                     console.log('setCharacter error');
                });
        },

        getTaskState(tS,i){
            this.taskState = tS;
            this.taskItems[i].state = this.taskState;
            this.flag=true;
        },



        jumpToTaskDetail(id) {
            this.$router.push({path: `/MainPage/task_detail/${id}`})
        },
        sendToMainPage() {
            let data = {
                active: '1-1',
                open: '1'
            };
            this.$emit('menuSelected', data);
        },


    },



}
</script>
