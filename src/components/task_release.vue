<style scoped>

.content {
    padding: 15px;
    background-color: #fffff0;
    height:
}

.task {
    position: relative;
    padding: 10px;
    width:60%;
    margin-left: 25%;
}

.input-style {
    margin-left:10px;
}

.span-style {
    font-size: 18px;
    margin-top:3px;
}

.div-formItem {
    margin-top: 20px;
    margin-bottom: 20px;
}

.div-flex {
    display:flex;
    flex-wrap:wrap;
    width: 100%;
}

.div-tasktype {
    display:flex;
    flex-wrap:wrap;
    width:50%;
}


.tips{
    margin-top: 7px;
    margin-left: 15px;
    font-size: 12px;
    color: #ff0000;
}

</style>

<template>
    <div class="content">
        <h1 style="text-align: center;">任务发布</h1>
            <div class="task">
                <div >
                    <div class="div-tasktype">
                        <span class="span-style">任务类型</span>
                        <Select class="input-style"  v-model="taskInfo.type" style="width:50%" label="问卷调查" :on-change="changeTaskType()">
                            <Option v-for="item in taskType" :value="item.value" :key="item.value" >{{ item.label }}</Option>
                        </Select>
                    </div>
                    <div class="div-formItem div-flex">
                        <span class="span-style">任务标题</span>
                        <Input  class="input-style"   :rows="1" placeholder="请输入任务标题" clearable style="width: 25%" v-model="taskInfo.title"></Input>
                        <p class="tips" v-if="taskInfo.introduction == ''&& !newPublish">输入不能为空</p>
                    </div>
                    <div  class="div-formItem div-flex">
                        <span class="span-style" >任务简介</span>
                        <Input  class="input-style"  placeholder="请输入任务简介" type="textarea" :rows="4" style="width: 50%" v-model="taskInfo.introduction"></Input>
                        <p v-if="taskInfo.introduction == ''&& !newPublish" style="margin-top:45px; margin-left:20px; font-size:12px; color:#ff0000" >输入不能为空</p>
                    </div>
                    <div class="div-formItem div-flex" >
                        <span class="span-style">任务金额</span>
                        <InputNumber class="input-style"  :min="1" v-model="taskInfo.money" :rows="1" style="width: 10%;"></InputNumber>
                        <span class="span-style" style="margin-left: 5%">任务数量</span>
                        <InputNumber class="input-style"  :min="1" v-model="taskInfo.number" :rows="1" style="width: 10%;"></InputNumber>
                    </div>
                    <div class="div-formItem div-flex">
                        <span class="span-style">截止时间</span>
                        <div style="display:flex">
                            <DatePicker class="input-style"  type="datetime"  :options="disabledTime" placeholder="请选择日期" style="width: 200px;" v-model="taskInfo.endtime"></DatePicker>
                        </div>
                        <p class="tips" v-if="taskInfo.introduction == ''&& !newPublish">输入不能为空</p>
                    </div>
                    <div class="div-formItem div-flex">
                        <span class="span-style" >联系方式</span>
                        <Input  class="input-style"   :rows="1" placeholder="请输入联系方式" clearable style="width: 50%" v-model="taskInfo.phone"></Input>
                        <p class="tips" v-if="taskInfo.introduction == ''&& !newPublish">输入不能为空</p>
                    </div>
                    <div class="div-formItem div-flex"  v-show="isQuestionaire">
                        <span class="span-style" >问卷链接</span>
                        <Input  class="input-style"   :rows="1" placeholder="请输入问卷链接" clearable style="width: 50%" type="textarea" v-model="taskInfo.questionnaireurl"></Input>
                        <p class="tips" v-if="taskInfo.introduction == ''&& !newPublish">输入不能为空</p>
                    </div>
                    <div class="div-formItem">
                        <span class="span-style" style="display: block">具体要求</span>
                        <Input  placeholder="请输入具体要求" type="textarea" :rows="8" style="width: 75%; position:relative; margin-top:25px;" v-model="taskInfo.content"></Input>
                    </div>
                </div>

                <Button type="primary"  @click="releaseTask(taskInfo)" style="font-size: 20px;float: right;margin-right: 30px;" :disabled="isUploading">发布任务</Button>
                <Modal
                    v-model="isModalShow"
                    title="确认发布"
                    @on-ok="ok"
                    @on-cancel="cancel"
                    :loading="loading">
                    <p>是否发布该任务</p>
                </Modal>
            </div>
            <!--Rencent task list-->

    </div>
</template>

<script scoped>
var SHA256 = require("crypto-js/sha256");
export default {
    inject: ['backTop'],
    data() {
        return {
            username: '',
            type: 0,
            password: '',
            money: 0,
            newPublish: true,
            isUploading: false,
            loading: true,
            isQuestionaire: true,
            isModalShow: false,

            //selector item
            taskType: [
                {
                    value: 1,
                    label: '问卷调查'
                },
                {
                    value: 2,
                    label: '跑腿'
                },

            ],

            groupRangeType: [
                {
                    value: 1,
                    label: '全部'
                },

            ],

            defaultGroupRangeType:[],
            //the highlight color item id
            enterItemId: '',
            disabledTime: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }

            },


            taskInfo :{
                title: '',
                introduction: '',
                max_accepter_number: 1,
                money: 1,
                endtime: '',
                starttime: '',
                type: 1,
                questionnaireurl:'',
                score: 0,
                content: '',
                range: 1

            },
            taskItems: [

            ],



        };
    },

    mounted() {
        this.backTop();
        Date.prototype.Format = function (fmt) { //author: meizz
                let o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (let k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
        };
        this.getUserInfo();
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
                    vm.money = userInfo.money;
                }

            })
            .catch(function (error) {
                if (error.response.status == 401) {
                    vm.$Notice.warning({
                        title: '出现错误',
                        desc:  "请重新登录"
                    });
                    vm.$router.push({name: 'login'});
                }
            });
        },

        changeTaskType(){
            if (this.taskInfo.type == 1){
                this.isQuestionaire = true;
            }else {
                this.isQuestionaire = false;
            }
        },

        ok() {
            this.isModalShow = false;
            this.postTaskInfo(this.taskInfo);

        },

        cancel() {
        },

        releaseTask(taskInfo) {

            let isError = false;
            this.newPublish = false;
            let endtime_date = new Date(taskInfo.endtime);
            let starttime_date = new Date();

            if (taskInfo.title == '') {
                this.$Notice.warning({
                    title: '缺少任务标题',
                });
                isError = true;
            }
            if (taskInfo.introduction == '') {
                this.$Notice.warning({
                    title: '缺少任务简介',
                });
                isError = true;
            }
            if (taskInfo.endtime == '' ) {
                this.$Notice.warning({
                    title: '缺少任务结束时间',
                });
                isError = true;
            }
            if (endtime_date < starttime_date) {
                this.$Notice.warning({
                    title: '任务时间错误',
                });
                isError = true;

            }
            if (taskInfo.type == 1) {
                let len = taskInfo.questionnaireurl.length;
                if (len <= 0) {
                    this.$Notice.warning({
                    title: '问卷缺少链接',
                    });
                    isError = true;
                }

            }

            if (this.money < taskInfo.max_accepter_number * taskInfo.money) {
                this.$Notice.warning({
                    title: '闲钱币不足',
                });
                isError = true;
            }

            if (!isError)
            {
                this.isModalShow = true;
            }
        },



        postTaskInfo(taskInfo) {
            let endtime = new Date(taskInfo.endtime).Format("yyyy-MM-dd hh:mm:ss");
            let starttime = new Date().Format("yyyy-MM-dd hh:mm:ss");
            taskInfo.endtime = endtime;
            taskInfo.starttime = starttime;

            let vm = this;
            let url = '';
            url ='/api/v1/task';

            if(vm.type == 1 && taskInfo.range[0] == 'myOrg') {
                taskInfo.range = [];

            }

            this.$axios.post(url, {
                title: taskInfo.title,
                introduction: taskInfo.introduction,
                money: taskInfo.money,
                score: taskInfo.score,
                max_accepter_number: taskInfo.max_accepter_number,
                publisher: vm.username,
                type: taskInfo.type,
                starttime: taskInfo.starttime,
                endtime: taskInfo.endtime,
                content: taskInfo.content,
                questionnaire_path: taskInfo.questionnaireurl,
                range: taskInfo.range
            })

            .then(function(response) {
                let data = response.data;
                if (data.code == 200) {
                        vm.$Notice.success({
                        title: '任务成功发布',
                    });
                    vm.showTaskDetail(data.data.task_id);
                }

            })
            .catch(function (error) {
                if (error.response.status == 401) {

                    vm.$Notice.warning({
                        title: '出现错误',
                        desc:  "请重新登录"
                    });
                    vm.$router.push({name: 'login'});

                }
            });
        },

        showTaskDetail(tid){
            this.$router.push({path: `/MainPage/task_detail/${tid}`});
        },

        sendToMainPage() {
            let data = {
                active: '1-2',
                open: '1'
            };
            this.$emit('menuSelected', data);
        }


    }

}
</script>
