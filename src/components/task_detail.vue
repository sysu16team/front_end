

<style scoped>


.btn {
    margin-top: 15px;
    font-size: 10px;
}

.connect {
  font-weight: bold;
  font-size: 17px;
  margin: auto;
}

.taskBody {
    padding: 20px;
    position:relative;
    min-width: 1000px;
    background-color: #fffff0;
    display: flex;
}

.taskDetailBody {
    width: 80%;
    margin: auto;
}

.detail-body {
    position:relative;
    margin-top: 10px;
    margin-bottom: 10px;
}

.taskInfodiv {
    margin-top: 30px;
}

.taskInfoCell {
    width: 33%;
    height: 50px;
}
.timeDiv {
  width: 50%;
}

.timdSpan {
    font-size: 17px;
    font-weight: bold;
}

.taskBtn {
    position:relative;
    float:right;
}

.table-whole {
    width:1000px;
    border: 2px solid grey;
    height: 100%;
    color: black;
    font-size: 20px;
}

.table-header th {
    height:40px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #fffff0;
}

.table-header td, .table-body td{
    height:48px;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align:middle;
}

.labelHead {
    word-wrap:normal;
    vertical-align: middle;
    box-sizing: border-box;
    padding-left: 18px;
    padding-right: 18px;
    overflow: hidden;
}

</style>

<template>
    <div class="taskBody">
        <div class="taskDetailBody">
            <h1 id="title" style="font-size: 40px">任务详情</h1>
            <div class="detail-body">
                <div class="detail">
                    <div class="taskInfodiv">
                        <div class="taskInfodiv">
                            <span style="font-size: 30px">{{ task.title }} </span>
                        </div>
                    </div>
                    <div class="taskInfoCell">
                            <div @click="jumpToReleaserInfo()">
                                <Avatar :src="avatar" > </Avatar>
                                <span style="line-height: 50px;">{{ task.publisher }} </span>
                            </div>
                    </div>
                    <span style="font-size:17px; font-weight:bold;" >任务类型：</span>
                    <span class="taskInfodiv timdSpan" style="margin-left:10px">{{ task.type_label }} </span>
                    <div class="taskInfodiv">
                      <span style="font-size:17px; font-weight:bold;">任务金额:</span>
                      <span class="connect" style="margin-left: 10px;">{{task.money}}</span>
                    </div>
                    <div class="taskInfodiv div-flex" v-if="isAcceptor">
                        <div class="taskInfoCell" >
                            <span style="font-size:17px; font-weight:bold;">任务状态：</span>
                            <span style="font-size:17px; font-weight:bold; margin-left:10px;" >{{buttonState}}</span>
                        </div>
                    </div>
                    <div class="taskInfodiv div-flex">
                        <div class="taskInfoCell" v-show="isReleaser">
                            <span style="font-size:17px; font-weight:bold;">任务数量: </span>
                            <span style="font-size:17px; font-weight:bold; margin-left:10px;">{{task.max_accepter_number}}</span>
                        </div>
                    </div>
                    <div class="taskInfodiv">
                        <div style="display: flex">
                            <div class="timeDiv" >
                                <span class="timdSpan">{{task.starttime}} </span>
                              <span class="connect">——</span>
                                <span class="timdSpan">{{task.endtime}} </span>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="taskInfodiv">
                        <h1 id="intro">简介</h1>
                        <p style="font-size:17px; font-weight:bold;">{{ task.introduction }} </p>
                    <div id="requirement" class="taskInfodiv taskInfoCell" v-show="isAcceptor || isReleaser">
                      <div class="releaser-info">
                        <h1>具体要求与联系方式</h1>
                        <p style="font-size:17px; font-weight:bold;">{{task.content}}</p>
                      </div>
                    </div>
                </div>
            </div>
            <div class="taskBtn">
                <Button @click="isShowDetail = !isShowDetail" type="info" v-show="isReleaser" >任务情况</Button>
                <div>
                  <Button class="btn" type="success" long v-show="!isAcceptor && !isReleaser" @click="acceptTask()" :disabled="userInfo.type == 1">接受任务</Button>
                  <Button class="btn" type="primary" long v-show="isAcceptor && isDoing" @click="completeTask()">完成任务</Button>
                  <Button class="btn" type="error" long v-show="isAcceptor && isDoing" @click="quitingTask()">放弃任务</Button>
                  <Button class="btn" type="error" long  @click="cancelTask()" v-if="!isCompleted && isReleaser">取消任务</Button>
                  <Button class="btn" type="success" long  v-if="isCompleted && isReleaser">已完成</Button>
              </div>
            </div>

       </div>

    </div>



</template>


<script scoped>
export default {
    inject: ['reload', 'backTop'],

    data () {
        return {
            userInfo:{},

            task_id: '',
            isReleaser: false,
            isAcceptor: false,
            buttonState: '',
            isDoing: true,
            isCompleted: false,
            scoreValue: 0,
            isShowDetail: false,
            trs: [],
            selectedTr:[],
            tr:  {
                score:0,
            },
            avatar:'',
            task: {
                title: 'xxxxxx',
                introduction: '',
                money: 10,
                max_accepter_number: 10,
                publisher : '***',
                state: 0,
                type: 2,
                starttime: '',
                endtime: '',
                content:''
            },




        }
    },

    mounted() {
        this.backTop();
        this.task_id = this.$route.params.id;
        this.getMyUserInfo();


    },
    watch: {

        '$route'(to, from) {
            this.task_id = this.$route.params.id;
            this.getMyUserInfo();
        }
    },

    methods: {

        getMyUserInfo(){
            let vm = this;
            let url = '/api/v1/user/getPersonalInfo'
            this.$axios.get(url, {

            })
            .then(function(response) {
                let data = response.data;
                if (data.code == 200) {
                    vm.userInfo = data.data;
                    vm.getTaskDetail();
                }

            })
            .catch(function (error) {
                if (error.response.status == 401) {
                    vm.$Notice.warning({
                        title: '错误',
                        desc:  "请重新登录"
                    });
                    vm.$router.push({name: 'login'});
                }
            });
        },

        getTaskDetail:function() {
            let vm = this;
            let url ='/api/v1/task/findByTaskId'

            this.$axios.get(url, {
                params: {
                    task_id: vm.task_id
                }
            })
            .then(function(response) {
                let data = response.data;
                if (data.code == 200) {
                    let task = data.data;

                    if(task == null) {
                        vm.$router.go(-1);
                         vm.$Notice.warning({
                            title: '任务不存在',
                        });
                        return;
                    }

                    if (task.type == 1) {
                        task["type_label"] = '问卷调查';
                    } else {
                        task["type_label"] = '跑腿';
                    }

                    vm.task = task;
                    vm.setCharactor();
                    vm.getUserInfo();
                }



            })
            .catch(function (error) {
                console.log('error');
            });

        },

        getUserInfo:function() {
            let vm = this;
            let url = '/api/v1/user/getuser';

            this.$axios.get(url, {
                params: {
                    username: vm.task.publisher
                }
            })
            .then(function(response) {
                let data = response.data;
                if (data.code == 200) {
                    // console.log(data);
                    vm.avatar = data.data.avatar;
                    vm.name = data.data.name;
                }

            })
            .catch(function (error) {
                console.log('userInfo error');
            });

        },


        setCharactor: function() {

            let vm = this;
            let taskinfo = vm.task;

            vm.getTaskRelation();
            if (taskinfo.publisher == vm.userInfo.username) {
                vm.isReleaser = true;

                if (taskinfo.state == 3) {
                    vm.isCompleted = true;
                } else {
                    vm.isCompleted = false;
                }

            } else {
                let url = '/api/v1/task/acceptance'
                this.$axios.get(url, {
                    params:{
                        task_id: vm.task_id,
                        username: vm.userInfo.username
                    }
                })
                .then(function(response) {

                    let tr = response.data.data;
                    if (tr == null) {
                        vm.isAcceptor = false;
                    } else {
                        vm.tr = tr;
                        vm.isAcceptor = true;
                        // console.log('test');
                        if (vm.tr.state == 1) {
                            vm.buttonState = '待确认';
                            vm.isDoing = false;
                        } else if (vm.tr.state == 2) {
                            vm.buttonState = '已完成';
                            vm.isDoing = false;
                        } else{
                            vm.buttonState = '进行中';
                        }
                        if (vm.tr.state == 2) {
                            vm.isCompleted = true;
                        }
                    }
                })
                .catch(function (error) {
                     console.log('setCharacter error');
                });
            }
        },



        getTaskRelation: function() {
            let vm = this;
            let url = '/api/v1/task/accepter'

            this.$axios.get(url, {
                params: {
                    task_id: vm.task_id,
                }
            })
            .then(function(response) {

                let data = response.data;
                if (data.code == 200) {
                    let trs = data.data;
                    for(let i = 0;i < trs.length;i ++) {
                        if (trs[i].state == 0) {
                            trs[i]["label"] = '任务进行中';
                        } else if (trs[i].state == 1) {
                            trs[i]["label"]  = '任务待确认';
                        } else if (trs[i].state == 2) {
                            trs[i]["label"]  = '任务已完成';
                        }
                    }
                    vm.trs = trs;
                }
            })
            .catch(function (error) {
                console.log('get tr error');
            });
        },

        confirmTaskSingle:function(username_, score_, index) {
            let username_arr = []
            let index_arr = []
            let score_arr =[]
            username_arr.push(username_);
            index_arr.push(index);
            score_arr.push(score_)

            this.confirmTask(username_arr, score_arr, index_arr);

        },

        confirmTaskMutiple(score_) {
            let username_arr = [];
            let index_arr = [];
            let score_arr = [];

            for(let i = 0;i < this.trs.length;i ++) {
                if (this.trs[i].state == 1) {
                    username_arr.push(this.trs[i].username);
                    index_arr.push(i);
                    score_arr.push(score_);
                }
            }
            this.confirmTask(username_arr, score_arr, index_arr);
        },

        jumpToReleaserInfo() {
            this.$router.push({name: 'userinfo', params: {username: this.task.publisher}});
        }
    }
}


</script>
