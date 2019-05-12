<style scoped>
span {
    margin:3px;
  }
  .uniform-fontsize {
    font-size: 16px;
  }

  a {
    color: #e7e9ec;
  }

  .te {
    background: black;
  }

  .layout{
    background-color: #fffff0;

  }

  .dropDown{
    z-index: 1000;
  }

  .layout-bottom{
    position:absolute;
    top:70px;
    bottom:0px;
    left:0px;
    right:0px;
    height:auto;
    min-width: 960px;
    background-color: #fffff0;
  }

  .layout-header{
    right:0px;
    left:0px;
    position:fixed;
    z-index: 1000;
    vertical-align: middle;
    border: 1px solid #dcdee2;
    height: 70px;
  }


  .layout-header-left{
    float: left;
    vertical-align: middle;
    width: 50%;
    line-height: 70px;
  }

  .layout-sider {
    position:fixed;
    top:70px;
    bottom:0px;
    border: 1px solid #d7dde4;
    z-index: 10;
  }



  .layout-content {
    position:absolute;
    left:200px;
    top:0px;
    bottom:0px;
    right:0px;
  }

  .menu-content{
    width: 25%;
    z-index:10001;
    float:right;
  }

  .avatar {
    width: 32px;
    height: 32px;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    border-radius: 50%;
    line-height: 32px;
    cursor: pointer;
    background: yellow;
  }

  .avatarImg {
    width: 32px;
    height: 32px;
  }

  .back-top-btn {
    background-color: rgba(0, 0, 0, 0.6);
    text-align: center;
    border-radius: 2px;
    box-shadow: 0px 1px 3px rgba(0,0,0,0.2);
  }

  .back-top-btn-show {
    background-color: rgba(0, 0, 0, 1);
  }

  .fade1-enter-active, .fade1-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade1-enter, .fade1-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
.layout-logo{
   float: left;
    vertical-align: middle;
    line-height: 70px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
.layout-footer-center{
    text-align: center;
}


  .layout-header-right {
    float: right;
    vertical-align: middle;
    line-height: 70px;
  }
</style>



<template>
    <div class="layout">
        <Layout>
         <Header >
           <transition name="fade1">
            <Message :message="message" :accTeamJoin="accTeamJoin"
                    @mouseleave.native="showMsg=false"
                    v-show="message.length&&showMsg"
                    style="z-index: 1000;">
            </Message>
          </transition>
              <div class="layout-header-left">
                 <Badge :count="message.length" style="height: 32px; line-height: 32px; margin-right: 20px;">
                    <Icon @click="showMessage" type="ios-notifications-outline" size="26" style="cursor: pointer"></Icon>
                  </Badge>
                    <div class="avatar" @click="jumpToUserInfoPage">

                    </div>
                   <Dropdown>
                     <span>{{userInfo.username}}</span>
                  <Icon type="ios-arrow-down" size="24" style="margin: 7px; color:#2d8cf0" />
                  <DropdownMenu class="dropDown" slot="list">
                    <DropdownItem  @click.native="jumpToPersonalPage">
                      <Icon  type="md-person" /> 个人信息
                    </DropdownItem>
                    <DropdownItem @click.native="jumpToLoginPage">
                      <Icon type="ios-power" /> 退出
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <Menu class="menu-content" mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo"></div>
                    <div class="layout-nav">
                        <MenuItem name="1">
                          <Dropdown>
                            <a href="javascript:void(0)">
                                任务管理
                                <Icon type="ios-navigate"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                              <router-link to="/MainPage/task_search">
                                <DropdownItem>搜索任务</DropdownItem>
                              </router-link>
                              <router-link to="/MainPage/task_release">
                                <DropdownItem>发布任务</DropdownItem>
                              </router-link>
                              <router-link to="/MainPage/my_task">
                                <DropdownItem>我的任务</DropdownItem>
                              </router-link>
                            </DropdownMenu>
                          </Dropdown>
                        </MenuItem>
                        <MenuItem name="2">
                          <Dropdown>
                            <a href="javascript:void(0)">
                                小组管理
                                <Icon type="ios-people-outline"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                              <router-link to="/MainPage/groupSearch">
                                <DropdownItem>搜索小组</DropdownItem>
                              </router-link>
                              <router-link to="/MainPage/mygroup">
                                <DropdownItem>我的小组</DropdownItem>
                              </router-link>
                              <router-link to="/MainPage/createGroup">
                                <DropdownItem>创建小组</DropdownItem>
                              </router-link>
                            </DropdownMenu>
                          </Dropdown>
                        </MenuItem>

                    </div>
                </Menu>

          </Header>


          <div class="layout-content">
            <BackTop>
              <div v-on:mouseenter="inBackTop=true" v-on:mouseleave="inBackTop=false"
                  v-bind:class="['back-top-btn', {'back-top-btn-show': inBackTop}]">
                <Icon type="ios-arrow-up" size="24" />
              </div>
            </BackTop>
          </div>
        </Layout>
        <div>
              <router-view :userInfo="userInfo"></router-view>
        </div>
    </div>

</template>


<script>
  import Message from './message.vue'

  export default {
    data() {
      return {
        userInfo: {},

        message: [],
        accTeamJoin: [],

        showMsg: false,
        inBackTop: false,
        isRouterAlive:true,

        taskList: [
          {
            value: 'All',
            label: '全部'
          },
          {
            value: 'Questionaire',
            label: '问卷调查'
          },
          {
            value: 'Express',
            label: '取快递'
          },

        ],

        rangeList: [
          {
            value: 'All',
            label: '全部'
          },
          {
            value: 'Group1',
            label: '小组1'
          },
        ],
        taskClass: '',
        range: '',

        menuActive: '1-1',
        menuOpen: ['1'],
      };
    },
    mounted() {
      this.$axios.get('api/v1/user/getPersonalInfo')
        .then(msg => {
          if (msg.data.code == 200) {
            this.userInfo = msg.data.data;

          }
        })
        .catch(err => {
          if (err.response.status == 401) {
            this.$router.push({name: 'login'});
            this.$Message.error('请登录');
          }
        });


      this.$Notice.config({
        top: 100,
        duration: 3
      });

      this.getMessage();


    },

    methods: {
      jumpToPersonalPage() {
        this.$router.push({path: `/personalpage/personalinfo`});
      },

      jumpToUserInfoPage() {
        this.$router.push({path: `/user/` + this.userInfo.username});
      },

      jumpToLoginPage() {
        this.$axios.get('api/v1/user/logout').then(msg => {
          if (msg.data.code == 200) {
            this.$router.push({name: `login`});
            this.$Message.success('退出成功！');
          }
          else {
            this.$router.push({name: `login`});
            this.$Message.error(msg.data.msg);
          }
        }).catch(err => {
          this.$router.push({name: `login`});
          this.$Message.error(err.response.statusText);
        });
      },

      getMessage() {

        this.$axios.get('/api/v1/toast')
          .then(msg => {
            if (msg.data.code == 200) {

              this.message = msg.data.data;
              let joinTeamType = [0, 7];
              this.message.sort((msg1, msg2) => {
                let msg1isJoinMsg = joinTeamType.includes(msg1.type);
                let msg2isJoinMsg = joinTeamType.includes(msg2.type);
                if (msg1isJoinMsg && !msg2isJoinMsg) return -1;
                if (!msg1isJoinMsg && msg2isJoinMsg) return 1;
                return msg2.id - msg1.id;
              });
              //alert(this.message.length);

              for (let i = 0; i < this.message.length; i++) {
                if (!joinTeamType.includes(this.message[i].type)) {
                  this.accTeamJoin = new Array(i);
                  break;
                }
              }
              this.accTeamJoin.fill(-1);
            }
          });
      },

      hiddenMessage() {
        this.showMsg = false;
      },

      showMessage() {
        this.showMsg = true;
        this.getMessage();
      },

      reload() {
        this.isRouterAlive = false;
        this.$nextTick(function() {
          this.isRouterAlive = true;
        })
      },

      updateMenu(value) {
        if (!this.menuOpen.includes(value.open)) this.menuOpen.push(value.open);
        this.menuActive = value.active;
        this.$nextTick(() => {
          this.$refs.menu.updateOpened();
          this.$refs.menu.updateActiveName();
        })
      },

      backTop() {
        window.scrollTo(0,0);

      }
    },

    provide() {
      return {
        reload: this.reload,
        backTop: this.backTop
      }
    },

    components: {
      Message
    },

    watch: {
      '$route.path': 'hiddenMessage'
    }
  }
</script>
