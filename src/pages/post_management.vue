<template>
  <q-page class="q-pa-sm">
    <div class="row q-gutter-sm justify-evenly q-mt-md">
      <div class="col col-md-8 col-12">
        <PostsTable :data="data"></PostsTable>
      </div>
      <div class="col col-md-3 col-12">
        <q-option-group
          v-model="indexSearchPanel"
          inline
          :options="[
            { label: '按组织', value: 'ruleOrg' },
            { label: '全部', value: 'ruleAll' }
          ]"
        />

        <q-tab-panels
          v-model="indexSearchPanel"
          class="shadow-2 rounded-borders"
        >
          <q-tab-panel name="ruleOrg">
            <q-form @submit="onFindSubmit('byOrg')" class="q-gutter-md">
              <q-select
                v-model="currOrg"
                :options="orgsOptions"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                hide-bottom-space
                :rules="[val => !!val || '请输入组织']"
                label="选择组织*"
                filled
              />
              <q-select
                v-model="currGroup"
                :options="groupsOptions"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                label="选择群组"
                hint="默认为全部群组"
                filled
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.stop="currGroup = ''"
                    class="cursor-pointer"
                  /> </template
              ></q-select>
              <div>
                <q-btn
                  label="查找"
                  type="submit"
                  icon="search"
                  color="primary"
                />
              </div>
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="ruleAll">
            <q-btn
              color="primary"
              icon="search"
              label="显示全部"
              @click="onFindSubmit('all')"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>
import { getPostList } from "src/api/post";
import { getOrgList } from "src/api/org";
import { getGroupList } from "src/api/group";
import PostsTable from "src/components/PostsTable";
import { exportFile } from "quasar";

export default {
  components: {
    PostsTable
  },
  data() {
    return {
      indexSearchPanel: "ruleOrg",
      currOrg: "",
      currGroup: "",
      orgsOptions: [],
      groupsOptions: [],
      data: [],
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  created() {
    this.fetch();
  },
  watch: {
    currOrg: function() {
      this.getGroupOpts();
    }
  },
  methods: {
    async fetch() {
      this.$q.loading.show({
        message: "加载中..."
      });
      const { data } = await getOrgList({ type: "query" });
      this.orgsOptions = data;
      this.$q.loading.hide();
    },
    async getGroupOpts() {
      const { data } = await getGroupList({
        type: "query",
        orgId: this.currOrg
      });
      this.groupsOptions = data;
    },
    async onFindSubmit(type) {
      this.$q.loading.show({
        message: "加载中..."
      });
      if (type === "all") {
        const { data } = await getPostList({
          org: "all",
          group: "all"
        });
        this.data = data;
      } else if (type === "byOrg") {
        const { data } = await getPostList({
          org: this.currOrg,
          group: this.currGroup
        });
        this.data = data;
      }
      this.$q.loading.hide();
    }
  }
};
</script>
