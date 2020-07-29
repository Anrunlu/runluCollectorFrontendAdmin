<template>
  <q-page class="q-pa-sm">
    <div class="row q-gutter-sm justify-evenly q-mt-md">
      <div class="col col-11">
        <OrgsTable :data="data" @fetch='fetch'></OrgsTable>
      </div>
    </div>
  </q-page>
</template>

<script>
import { getOrgList } from "src/api/org";
import { getGroupList } from "src/api/group";
import OrgsTable from "src/components/OrgsTable";
import { exportFile } from "quasar";

export default {
  components: {
    OrgsTable,
  },
  data() {
    return {
      data: [],
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.$q.loading.show({
        message: "加载中..."
      });
      const { data } = await getOrgList({ type: "all" });
      this.data = data;
      this.$q.loading.hide();
    },
  }
};
</script>
