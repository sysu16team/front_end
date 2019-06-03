

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
            <div v-if="isShowDetail">
                <Divider></Divider>
                <span style="font-size:17px; font-weight:bold;">任务完成情况</span>
                <div class="table-whole" >
                    <div class="table-header">
                        <table style="width: 100%;" border="1px" cellspacing="0" >
                            <thead>
                                <tr>
                                    <th  style="width:30%">
                                        <div class="labelHead">
                                            <span>用户</span>
                                        </div>
                                    </th>
                                    <th  style="width:30%">
                                        <div class="labelHead">
                                            <span>任务状态</span>
                                        </div>
                                    </th>
                                    <th style="width:40%">
                                        <span>确认完成任务</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="(item,index) in trs">
                                    <td  style="width:30%">
                                        <div class="labelHead">
                                            <Avatar :src="item.avatar"></Avatar>
                                            <strong>{{ item.username }}</strong>
                                        </div>
                                    </td>
                                    <td  style="width:30%">
                                        <div class="labelHead">
                                            <span style="margin-left: 75px;">{{ item.label }}</span>
                                        </div>
                                    </td>
                                    <td style="width:40%">
                                        <div class="labelHead" style="display: flex">
                                                 <Button type="primary" style="width: 50%; margin-left: 25%;" :disabled="item.state != 1" @click="confirmTaskMutiple(scoreValue)">确认完成</Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                </div>
            <div style="position: relative; margin-left:910px; margin-top:10px;">
                    <Button type="success"  @click="confirmTaskMutiple(scoreValue)">一键确认</Button>
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


        acceptTask: function() {

            let vm = this;
            let url = '/api/v1/task/acceptance';

            this.$axios.post(url, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                username: vm.userInfo.username,
                task_id: vm.task.task_id
            })
            .then(function(response) {
                let data = response.data;
                let msg = data.msg;
                if (data.code == 200) {
                    vm.$Notice.success({
                        title: '任务接受成功',
                    });
                    vm.reload();

                } else{
                    vm.$Notice.warning({
                        title: msg,
                    });
                    vm.reload();
                }

            })
            .catch(function (error) {
                if (error.response.status == 401) {
                    vm.$Notice.warning({
                        title: '错误',
                        desc:  "请重新登录"
                    });
                    vm.$router.push({name: 'login'});

               } else if (error.response.status == 500) {
                   if(error.response.data.data == 'Max accepter number reached') {
                       vm.$Notice.warning({
                            title: '任务人数已满',
                        });
                        vm.reload();
                   } else {
                        vm.$Notice.warning({
                            title: '任务不存在',
                        });
                        vm.$router.go(-1);
                    }
                }
            });
        },

        completeTask: function() {
            if (this.task.state == 4) {
                this.$Notice.warning({
                        title: '任务超过时限',
                    });
                vm.$router.push({name: 'login'});
                return;
            }
            let vm = this;
            let url = '/api/v1/task/complement'
            this.$axios.post(url, {
                task_id: vm.task_id,
                username: vm.userInfo.username

            })
            .then(function(response) {
                let data = response.data;
                let msg = data.msg;
                if (data.code == 200) {
                    vm.$Notice.success({
                        title: '任务待确认',
                    });
                    vm.reload();
                } else{
                    vm.$Notice.warning({
                        title: 'error',
                    });
                    vm.reload();
                }

            })
            .catch(function (error) {
                if (error.response.status == 401) {
                    vm.$Notice.warning({
                        title: '错误',
                        desc:  "请重新登录"
                    });
                    vm.$router.push({name: 'login'});

                } else if (error.response.status == 402) {
                    vm.$Notice.warning({
                        title: '超时错误',
                    });
                    }
                });
        },


        quitingTask:function() {
            let vm = this;
            let url = '/api/v1/task/acceptance';

            this.$axios.delete(url, {
                params: {
                    username: vm.userInfo.username,
                    task_id: vm.task.task_id
                }
            })
            .then(function(response) {
                let data = response.data;
                let msg = data.msg;
                if (data.code == 200) {
                    vm.$Notice.success({
                        title: '已退出任务',
                    });
                    vm.reload();
                } else{
                    vm.$Notice.warning({
                        title: msg,
                    });
                    vm.reload();
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

        cancelTask:function() {
            let vm = this;
            let url = '/api/v1/task';

            this.$axios.delete(url, {
                params: {
                    task_id: vm.task_id
                }
            })
            .then(function(response) {
                let data = response.data;
                let msg = data.msg;
                if (data.code == 200) {
                    vm.$Notice.success({
                        title: '任务已删除',
                    });
                    vm.$router.push({name: 'task_search'});
                } else if(data.code == 401){
                    vm.$Notice.warning({
                        title: msg,
                    });
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

        confirmTask(username_arr, score_arr, index_arr) {
            let vm = this;
            let url = '/api/v1/task/comfirm'
            this.$axios.post(url, {
                username: username_arr,
                score: score_arr,
                task_id: vm.task_id
            })

            .then(function(response) {
                let data = response.data;
                let msg = data.msg;
                if (data.code == 200) {
                     vm.$Notice.success({
                        title: '任务已确认',
                    });
                    for (let i = 0;i < index_arr.length;i ++) {
                         vm.trs[index_arr[i]].state = 2;
                         vm.trs[index_arr[i]].label = "任务已完成";
                    }


                    if (vm.trs.length < vm.task.max_accepter_number) {
                        vm.isCompleted = false;
                        return;
                    }

                    let isCompleted = true;
                    for (let i = 0;i < vm.trs.length;i ++) {
                        if (vm.trs[i].state != 2) {
                            isCompleted = false;
                            break;
                        }
                    }

                    if (isCompleted) {
                        vm.isCompleted = true;
                    }


                }  else {
                    vm.$Notice.warning({
                        title: 'Task Comfirm',
                        desc:  msg
                    });
                }

            })
            .catch(function (error) {
                if (error.response.status == 401) {

                    vm.$Notice.warning({
                        title: 'Task Confirm',
                        desc:  "Please Login first"
                    });
                    vm.$router.push({name: 'login'});

                }
            });
        },

        jumpToReleaserInfo() {
            this.$router.push({name: 'userinfo', params: {username: this.task.publisher}});
        }
    }
}


</script>
