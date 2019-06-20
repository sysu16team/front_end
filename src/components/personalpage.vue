<template>
    <div class="personal-page-body">
        <Layout>
            <div class="div-header">
                <Header >
                  <div class="layout-header-left">
                        <div class="avatar" @click="jumpToUserInfoPage">
                          <img class="avatarImg" :src="userInfo.avatar">
                        </div>
                      <Dropdown>
                        <span>{{userInfo.username}}</span>
                      <Icon type="ios-arrow-down" size="24" style="margin: 7px; color:#2d8cf0" />
                      <DropdownMenu class="dropDown" slot="list">
                        <DropdownItem  @click.native="jumpToMainPage">
                          <Icon  type="md-person" /> 首页
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
                        <router-link to="/personalpage/personalinfo">
                            <MenuItem name="1-1">个人信息</MenuItem>
                          </router-link>
                          <router-link to="/personalpage/deposit">
                            <MenuItem name="1-2">充值</MenuItem>
                          </router-link>
                          <router-link to="/personalpage/withdraw">
                            <MenuItem name="1-3">提现</MenuItem>
                          </router-link>
                    </div>
                </Menu>
                </Header>
            </div>
            </Layout>
             <div class="content">
              <router-view :userInfo="userInfo"></router-view>
            </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
          userInfo: {}
        }

     },

    mounted() {
      this.$axios.get('api/v1/user/getPersonalInfo')
      .then(msg => {
        if (msg.data.code == 200) {
          this.userInfo = msg.data.data;
          this.userInfo.score = parseFloat(this.userInfo.score.toFixed(1));
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response.status == 401) {
          this.$router.push({name: 'login'});
          this.$Message.error('请登录');
        }
      });
    },

    methods: {
        jumpToMainPage() {
            this.$router.push({path: `/MainPage`});
        },

        jumpToUserInfoPage() {
          this.$router.push({path: `/user/` + this.userinfo.username});
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


     }


}
</script>


<style scoped>

.uniform-fontsize {
    font-size: 16px;
}
div {
    margin:0px;
    padding: 0px;
}

.div-header {
    background-color: #fffff0;
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
}

.avatarImg {
  width: 32px;
  height: 32px;
}

.layout-header{
    right:0px;
    left:0px;
    position:fixed;
    z-index: 1000;
    vertical-align: middle;
    background: #363e4f;
    height:70px;
}

  .layout-header-left{
    float: left;
    vertical-align: middle;
    width: 50%;
    line-height: 70px;
  }

.layout-header-right {
    float: right;
    vertical-align: middle;
    line-height: 70px;
    position:relative;
    right: 30px;
}

.layout-bottom{
    position:relative;
    top:68px;
    width:auto;
    over-flow:hidden;
    text-align: center;

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

.layout-sider {
    position:fixed;
    top:70px;
    bottom:0px;
    left:-1px;
    border-top: 1px solid #000000;
    z-index: 10;
}

.content {
    position:absolute;
    left:200px;
    right:0px;
}

</style>
