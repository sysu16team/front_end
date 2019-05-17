/* eslint-disable */

<template>
    <div class="content-body">
        <div class="content">
            <div class="content-selector-block">
                <div style="margin-left: 15px;">
                    <Breadcrumb>
                        <BreadcrumbItem to="/MainPage/myGroup">我的小组</BreadcrumbItem>
                        <BreadcrumbItem :to="{name: 'groupDetail', params: {id: team_id, group: group}}">小组详情</BreadcrumbItem>
                        <BreadcrumbItem :to="{name: 'groupDetail', params: {id: team_id, group: group}}">{{team_name}}</BreadcrumbItem>
                        <BreadcrumbItem>修改资料</BreadcrumbItem>
                    </Breadcrumb>
                </div>
            </div>

            <Divider></Divider>

            <div class="main-content">
                <div class="basic-informations">
                    <Form ref="group" :model="group" :rules="ruleValidate" :label-width="120" style="margin-top:20px">
                        <FormItem label="小组名字" prop="team_name">
                            <Input v-model="group.team_name" class="input-style" placeholder="请输入小组名字"></Input>
                        </FormItem>
                        <FormItem label="描述" prop="description">
                            <Input v-model="group.description" class="input-style" placeholder="请输入小组描述" type="textarea" :rows="4"></Input>
                        </FormItem>
                        <FormItem label="进组权限" prop="limit">
                            <RadioGroup v-model="group.limit" class="margin-left" vertical>
                                <Radio label=0 style="width:80px">允许所有人</Radio>
                                <Radio label=1 style="width:80px">需要审核</Radio>
                                <Radio label=2 style="width:80px">禁止所有人</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="小组标签">
                            <div class="div-flex" >
                                <Cascader
                                    style="width: 100%"
                                    :data="defaultLabels"
                                    v-model="currentTeamLabel"
                                    :render-format="cascaderFormat"
                                    trigger="hover"
                                    @on-change="addTeamLabels">
                                </Cascader>
                            </div>
                            <Row>
                                <Tag type="border" color="primary" class="margin-left" v-for="item in teamlabels" :key="item" :name="item" closable @on-close="handleCloseLabels">{{ item }}</Tag>
                            </Row>
                        </FormItem>
                    </Form>
                </div>

            </div>

            <div class="modify-block">
                <Button type="success" class="button-modify" @click="modifyInfo">MODIFY</Button>
            </div>


        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            team_id: '',
            group: {
                team_name: '',
                leader: '',
                logo: '',
                description: '',
                limit: '',
                teamlabels: [],
                members: []
            },

            team_name: '',

            screenWidth: document.body.clientWidth,

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

            currentTeamLabel: [],

            teamlabels: [],

            logoUrl: '',
            logoFile: '',
            logoBlob: '',

            ruleValidate: {
                team_name: [
                    { required: true, message: 'The name cannot be empty', trigger: 'blur'}
                ]
            },
        };
    },
    methods: {
        cascaderFormat(labels, selectedData) {
            const index = labels.length - 1;
            return labels[index];
        },

        addTeamLabels(value, selectedData) {
            let len;
            if ((len = selectedData.length) != 0) {
                if (-1 == this.teamlabels.indexOf(selectedData[len - 1])) {
                    this.teamlabels.push(selectedData[len - 1].value);
                }
            }
        },

        handleCloseLabels(event, name) {
            const index = this.teamlabels.indexOf(name);
            this.teamlabels.splice(index, 1);
        },


        uploadGroupInfo() {
            let len = this.teamlabels.length
            this.group.teamlabels = [];
            for (let i = 0; i < len; i++) {
                this.group.teamlabels.push({label: this.teamlabels[i]});
            }

            let p = new Promise((resolve, reject) => {
                this.$axios.put('/api/v1/team', this.group)
                    .then(function(res) {
                        resolve(res.data);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            })

            return p;
        },

        modifyInfo() {
            this.$refs['group'].validate((valid) => {
                if (valid) {
                        this.uploadGroupInfo()
                            .then((data) => {
                                if (data.code == 200) {
                                    this.$Modal.info({
                                        title: '提示',
                                        content: '修改小组信息成功'
                                    });
                                    this.$router.push({name: 'groupDetail', params: {id: data.data.team_id}});
                                }
                            })
                            .catch((err) => {
                                if (err.response.status == 401) {
                                    this.$router.push({name: 'login'});
                                    this.$Message.error('请登录');
                                }
                            })
                    }
                
            })
        },

        render() {
            for (let i = 0, len = this.group.teamlabels.length; i < len; i++) {
                this.teamlabels.push(this.group.teamlabels[i]['label']);
            }
            this.logoUrl = this.group.logo;
        },

        sendToMainPage() {
            let data = {
                active: '2-3',
                open: '2'
            };
            this.$emit('menuSelected', data);
        },
    },
    mounted: function() {
        this.team_id = this.$route.params.id;
        this.group = this.$route.params.group;
        this.team_name = this.group.team_name;
        this.render();
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

.content-selector-block {
    position:relative;
    z-index: 999;
    margin: 10px;
}

.main-content {
    display: flex;
}

.input-style {
    margin-left: 10px;
    width: 90%;
}

.input-style2 {
    margin-right: 10px;
    flex: 1;
}

.margin-left {
    margin-left: 10px;
}

.button-create {
    bottom:10px;
}

.basic-informations {
    display: inline-block;
    width: 60%;
}

.div-flex {
    display: flex;
    margin-left: 10px;
    width: 90%;
}

.logo-content {
    display: inline-block;
    vertical-align: top;
    top: 0;
    height: 100%;
    flex: 1;
}

.logo-block {
    width: 200px;
    height: 200px;
    margin: auto;
}

.logo-title {
    margin: auto;
    text-align: center;
    font-size: 15pt;
    width: 200px;
}

.logo-image {
    width: 100%;
    height: 100%;
    border-radius: 5px;
}

.logo-image:hover {
    cursor: pointer;
}

.tags {
    margin-left: 10px;
}

.modify-block {
    text-align: center;
    float:left;
}

.upload-block {
    text-align: center;
}

.upload-box {
    width: 58px;
    height: 58px;
    line-height: 58px;
    border: 1px dashed #dcdee2;
    border-radius: 5px;
    display: inline-block;
    background: #ffffff;
    cursor: pointer;
}

.upload-box:hover {
    border-color: #2d8cf0;
}

#upload-input {
    display: none;
}

</style>
