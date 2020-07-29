<template>
  <q-page class="q-pa-sm">
    <div class="row q-gutter-sm justify-evenly q-mt-md">
      <div class="col col-md-8 col-12">
        <GroupsTable :data="data"></GroupsTable>
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
              <!-- <q-input
                v-model="currGroupname"
                type="text"
                label="输入群组名"
                hint="默认返回以上全部用户"
                filled
              /> -->
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

          <q-tab-panel name="ruleEmail">
            <q-form @submit="onFindSubmit('byEmail')" class="q-gutter-md">
              <q-input
                v-model="currEmail"
                label="输入邮箱"
                type="email"
                filled
              />
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
import { getOrgList } from "src/api/org";
import { getGroupList } from "src/api/group";
import GroupsTable from "src/components/GroupsTable";
import { exportFile } from "quasar";

export default {
  components: {
    GroupsTable,
  },
  data() {
    return {
      indexSearchPanel: "ruleOrg",
      currOrg: "",
      currGroupname: "",
      currEmail: "",
      orgsOptions: [],
      groupsOptions: [],
      newGroupDig: false,
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
    async onFindSubmit(type) {
      this.$q.loading.show({
        message: "加载中..."
      });
      if (type === "all") {
        const { data } = await getGroupList({
          type:'all',
          orgId: "all"
        });
        this.data = data;
      } else if (type === "byOrg") {
        const { data } = await getGroupList({
          type:'byOrgWithDetail',
          orgId: this.currOrg,
        });
        this.data = data;
      }
      this.$q.loading.hide();
    }
  }
};
</script>
