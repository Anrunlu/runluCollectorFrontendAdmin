<template>
  <q-layout view="lHh LpR lFf">
    <q-header
      reveal
      style="background: linear-gradient(145deg, rgb(74, 94, 137) 15%, rgb(30, 75, 131) 70%);"
    >
      <q-toolbar>
        <q-btn
          @click="left = !left"
          flat
          round
          dense
          icon="menu"
          class="q-mr-sm"
        />
        <!--          <q-avatar>-->
        <!--            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">-->
        <!--          </q-avatar>-->

        <q-toolbar-title>润鲁收集后台管理</q-toolbar-title>
        <q-btn flat round dense icon="fas fa-sign-out-alt" @click="logout" />
      </q-toolbar>
    </q-header>
    <q-drawer
      class="left-navigation text-white"
      show-if-above
      v-model="left"
      side="left"
      elevated
    >
      <div style="height: calc(100% - 117px);padding:10px">
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>

          <q-toolbar-title>管理员：{{$store.getters['user/nickname']}}</q-toolbar-title>
        </q-toolbar>
        <hr />
        <q-scroll-area style="height:100%;">
          <q-list padding>
<!--            <q-item
              active-class="tab-active"
              to="/"
              exact
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>

              <q-item-section>
                运行报表
              </q-item-section>
            </q-item>-->

            <q-item
              active-class="tab-active"
              to="/user_management"
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>

              <q-item-section>
                用户管理
              </q-item-section>
            </q-item>

            <q-item
              active-class="tab-active"
              to="/group_management"
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="group" />
              </q-item-section>

              <q-item-section>
                群组管理
              </q-item-section>
            </q-item>

            <q-item
              active-class="tab-active"
              to="/org_management"
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="school" />
              </q-item-section>

              <q-item-section>
                组织管理
              </q-item-section>
            </q-item>

            <q-item
              active-class="tab-active"
              to="/collections_management"
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="folder" />
              </q-item-section>

              <q-item-section>
                收集管理
              </q-item-section>
            </q-item>

            <q-item
              active-class="tab-active"
              to="/posts_management"
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="insert_drive_file" />
              </q-item-section>

              <q-item-section>
                文件管理
              </q-item-section>
            </q-item>

            <q-item
              active-class="tab-active"
              to="/push_notice"
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>

              <q-item-section>
                发布公告
              </q-item-section>
            </q-item>

            <q-item
              active-class="tab-active"
              to="/feedback_management"
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="message" />
              </q-item-section>

              <q-item-section>
                用户反馈
              </q-item-section>
            </q-item>

            <!-- <q-item
              active-class="tab-active"
              to="/settings"
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>

              <q-item-section>
                系统设置
              </q-item-section>
            </q-item> -->

            <!-- <q-item
              active-class="tab-active"
              to="/calendar"
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="calendar_today" />
              </q-item-section>

              <q-item-section>
                Calendar
              </q-item-section>
            </q-item>

            <q-item
              active-class="tab-active"
              to="/department"
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="business" />
              </q-item-section>

              <q-item-section>
                Department
              </q-item-section>
            </q-item>

            <q-item
              active-class="tab-active"
              to="/my_profile"
              class="q-ma-sm navigation-item"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="drafts" />
              </q-item-section>

              <q-item-section>
                My Profile
              </q-item-section>
            </q-item> -->
          </q-list>
        </q-scroll-area>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page class="row no-wrap">
        <div class="col">
          <div class="full-height">
            <q-scroll-area class="col q-pr-sm full-height" visible>
              <router-view />
            </q-scroll-area>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      left: false
    };
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/userLogout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style>
.q-drawer {
  background-image: url(https://cltdownload.anrunlu.net/lake.jpg) !important;
  background-size: cover !important;
}

.q-drawer__content {
  background-color: rgba(1, 1, 1, 0.75);
}

.navigation-item {
  border-radius: 5px;
}

.tab-active {
  background-color: green;
}

body {
  background: #f1f1f1 !important;
}
</style>
