<template>
  <div class="layout">
    <Layout>
      <Header>
        <span class="login-nav">
          <router-link to="/MainPage">
          <icon type="ios-home" size="24" color="white"/>
          </router-link>
        </span>
      </Header>
      <Content>
        <div class="content">

          <Row :gutter="18">
            <Col span="5">
              <div class="info">
                <img :src="userInfo.avatar">
                <div v-if="userInfo.type==0" class="info-row">姓名： <span>{{userInfo.name}}</span></div>
                <div v-else class="info-row">负责人： <span>{{userInfo.name}}</span></div>
                <div class="info-row">学校： <span>{{userInfo.school}}</span></div>
                <div v-if="userInfo.type==0" class="info-row">年级： <span>{{userInfo.grade}}</span></div>
                <div class="info-row">电话： <span>{{userInfo.phone}}</span></div>
                <div class="info-row">邮箱： <span>{{userInfo.email}}</span></div>
              </div>
            </Col>
            <Col span="19">
              <Menu mode="horizontal" :theme="primary" active-name="1" @on-select="click1">
                <MenuItem name="1" >
                    <Icon type="ios-paper"/>
                    我的任务
                </MenuItem>
                <MenuItem name="2" >
                    <Icon type="ios-paper-outline" />
                    已发布任务
                </MenuItem>
                <MenuItem name="3">
                    <Icon type="ios-paper" />
                    已完成任务

                </MenuItem>
                <MenuItem name="4" >
                    <Icon type="ios-construct"/>
                    发布记录
                </MenuItem>

              </Menu>
              <div v-if="flag==1">
                  <ul>
                    <li v-for="task in finishingTasks">
                      <router-link :to="'/MainPage/task_detail/' + task.task_id">
                        <Row class="history">
                          <Col span="16">
                            <h2 style="margin-bottom: 10px;">
                              {{task.title}}
                              <span style="color:#ed4014; margin-left: 10px;">
                              {{task.money}}￥
                          </span>
                            </h2>
                            <p>{{task.introduction}}</p>
                          </Col>
                          <Col span="8" style="text-align: center; position: absolute; right: 0; bottom: 25px;">
                            <p>{{task.starttime}} ~</p>
                            <p>{{task.endtime}}&nbsp;&nbsp;&nbsp;</p>
                          </Col>
                        </Row>
                      </router-link>
                    </li>
                  </ul>
                  <div v-if="finishingTasks.length==0" class="empty-hint">当前用户没有正在进行的任务</div>
              </div>
              <div v-if="flag==2">
                 <ul>
                    <li v-for="task in publishingTasks">
                      <router-link :to="'/MainPage/task_detail/' + task.task_id">
                        <Row class="history">
                          <Col span="16">
                            <h2 style="margin-bottom: 10px;">
                              {{task.title}}
                              <span style="color:#ed4014; margin-left: 10px;">
                              {{task.money}}￥
                          </span>
                            </h2>
                            <p>{{task.introduction}}</p>
                          </Col>
                          <Col span="8" style="text-align: center; position: absolute; right: 0; bottom: 25px;">
                            <p>{{task.starttime}} ~</p>
                            <p>{{task.endtime}}&nbsp;&nbsp;&nbsp;</p>
                          </Col>
                        </Row>
                      </router-link>
                    </li>
                  </ul>
                <div v-if="publishingTasks.length==0" class="empty-hint">当前用户没有正在发布的任务</div>
              </div>
              <div v-if="flag==3">
                 <ul>
                    <li v-for="task in finishedTasks">
                      <router-link :to="'/MainPage/task_detail/' + task.task_id">
                        <Row class="history">
                          <Col span="16">
                            <h2 style="margin-bottom: 10px;">
                              {{task.title}}
                              <span style="color:#ed4014; margin-left: 10px;">
                              {{task.money}}￥
                          </span>
                            </h2>
                            <p>{{task.introduction}}</p>
                          </Col>
                          <Col span="8" style="text-align: center; position: absolute; right: 0; bottom: 10px;">
                            <p>{{task.updatedAt}}</p>
                            <Rate allow-half show-text disabled v-model="task.tr.score">
                              <span style="color: #f5a623">{{task.tr.score}}</span>
                            </Rate>
                          </Col>
                        </Row>
                      </router-link>
                    </li>
                  </ul>
                  <div v-if="finishedTasks.length==0" class="empty-hint">当前用户还没有完成的任务</div>
              </div>
              <div v-if="flag==4">
                <ul>
                  <li v-for="task in publishedTasks">
                      <router-link :to="'/MainPage/task_detail/' + task.task_id">
                        <Row class="history">
                          <Col span="16">
                            <h2 style="margin-bottom: 10px;">
                              {{task.title}}
                              <span style="color:#ed4014; margin-left: 10px;">
                              {{task.money}}￥
                          </span>
                            </h2>
                            <p>{{task.introduction}}</p>
                          </Col>
                          <Col span="8" style="text-align: center; position: absolute; right: 0; bottom: 25px;">
                            <p>{{task.updatedAt}}</p>
                          </Col>
                        </Row>
                      </router-link>
                  </li>
                </ul>
                <div v-if="publishedTasks.length==0" class="empty-hint">当前用户还没有发布过的任务</div>
              </div>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  </div>

</template>
<script>
  export default {
    data() {
      return {
        userInfo: {},
        publishingTasks: [],
        publishedTasks: [],
        finishingTasks: [],
        finishedTasks: [],

        inBlackList: false,
        inFollowList: false,
        flag: 1
      };
    },

    methods: {
      getInfo() {
        this.userInfo = {};
        this.publishingTasks = this.publishedTasks = [];
        this.finishingTasks = this.finishedTasks = [];

        this.$axios.get('/api/v1/user/getuser?username='+ this.$route.params.username)
          .then(msg => {
            if (msg.data.code == 200) {
              this.userInfo = msg.data.data;
              this.userInfo.score = parseFloat(this.userInfo.score.toFixed(1));
            }
          })
          .catch(err => {
            this.$Message.error('用户不存在！');
          });


        this.$axios.get('/api/v1/task/findByPublisher?publisher='+ this.$route.params.username)
          .then(msg => {
            if (msg.data.code == 200) {
              this.publishingTasks = this.filterTaskType(msg.data.data, [0, 1, 2]);
              this.publishedTasks = this.filterTaskType(msg.data.data, [3]);
              this.addTaskTr(this.publishingTasks, this.$route.params.username);
              this.addTaskTr(this.publishedTasks, this.$route.params.username);
            }
          });

        this.$axios.get('/api/v1/task/findByAccepter?username='+ this.$route.params.username)
          .then(msg => {
            if (msg.data.code == 200) {
              this.finishingTasks = this.filterTaskType(msg.data.data, [1, 2]);
              this.finishedTasks = this.filterTaskType(msg.data.data, [3]);
              this.addTaskTr(this.finishingTasks, this.$route.params.username);
              this.addTaskTr(this.finishedTasks, this.$route.params.username);
            }
          });

        this.$axios.get('/api/v1/user/getUserBlacklist')
          .then(msg => {
            if (msg.data.code == 200) {
              this.inBlackList = msg.data.data.some(user => {
                return user.username == this.$route.params.username;
              });
            }
          });

        this.$axios.get('/api/v1/user/getUsersFollowedOrganizationsList')
          .then(msg => {
            if (msg.data.code == 200) {
              this.inFollowList = msg.data.data.some(org => {
                return org.orgname == this.$route.params.username;
              });
            }
          });

      },

      click1(name)
      {
        this.flag=name;
      },


      filterTaskType(arr, states) {
        return arr.filter((task) => {
          return states.includes(task.state);
        });
      },

      addTaskTr(arr, username) {
        arr.forEach((task) => {
          task.tr = task.trs.find((tr) => {
            return tr.username == username;
          });
        });
      },

      toggleBlack() {
        let url = '';
        if (this.inBlackList) url = '/api/v1/user/usercancelblack';
        else url = '/api/v1/user/userblacklist';

        this.$axios.post(url, {
            "username1": this.$route.params.username,
        })
          .then(msg => {
            if (msg.data.code == 200) {
              this.$Message.success(msg.data.msg);
              this.inBlackList = !this.inBlackList;
            }
            else {
              this.$Message.error(msg.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
            this.$Message.error(err.response.data.msg);
          });
      },

      toggleFollow() {
        let url = '';
        if (this.inFollowList) url = '/api/v1/user/cancelfollow';
        else url = '/api/v1/user/follow';

        this.$axios.post(url, {
          ins_name: this.$route.params.username
        })
          .then(msg => {
            if (msg.data.code == 200) {
              this.$Message.success(msg.data.msg);
              this.inFollowList = !this.inFollowList;
            }
            else {
              this.$Message.error(msg.data.msg);
            }
          })
          .catch(err => {
            console.log(err);
            this.$Message.error(err.response.data.msg);
          });
      }
    },

    created() {
      this.getInfo();
    },

    watch: {
      '$route.params': 'getInfo'
    }

  }
</script>


<style scoped>
  .layout {
    min-height: 100%;
    background: #f5f7f9;
    text-align: left;
  }

  .layout-header {
    background-color: #fff;
  }

  .login-nav {
    float: left;

  }

  .login-nav a {
    margin-left: 10px;
  }

  .content {
    width: 80%;
    margin: 0 auto;
  }

  .h {
    /*background: #19be6b;*/
    overflow: hidden;
    position: relative;
    background-size: cover;
    box-shadow: 0 0 0 1px #eee;
    border-radius: 4px;
  }

  .h img {
    float: left;
    width: 120px;
    height: 120px;
  }

  .h .username {
    margin: 20px 20px 0 140px;
    color: #fff;
    font-size: 24px;
  }

  .div-signature {
    margin: 20px 20px 20px 140px;
    color: #fff;
  }

  .action {
    float: right;
  }

  .name {
    margin-top: 16px;
  }

  .ivu-dropdown {
    color: #fff;
    float: right;
    margin: 5px 40px 0 0;
  }

  .info, .history {
    padding: 20px;
    border-radius: 10px;
    margin-top: 10px;
    overflow: hidden;
    background: #fff;
  }

  .info-row {
    margin-bottom: 20px;
  }

  .info h2, .history h2 {
    margin-bottom: 25px;
  }

  ul {
    list-style: none;
  }

  li {
    position: relative;
  }

  a {
    color: #515a6e;
  }

  .empty-hint {
    height: 228px;
    line-height: 228px;
    text-align: center;
    font-size: 16px;
    padding: 20px;
    border-radius: 5px;
    margin-top: 10px;
    overflow: hidden;
    background: #fff;
  }

</style>

<style>
  .ivu-tabs-bar {
    margin-bottom: 0;
    margin-top: 16px;
  }
</style>
