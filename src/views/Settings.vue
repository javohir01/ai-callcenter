<template>
  <v-container fluid v-loading="loading" class="call-container">
    <div class="d-flex justify-end">
      <el-button 
        type="primary" 
        class="add-button"
        @click="openCreateDialog"
      > 
        + Добавлять
      </el-button>
    </div>

    <div class="table-container">
      <v-data-table
        :headers="headers"
        :items="sipStore?.sips.sips"
        :loading="sipStore.loading"
        :items-per-page="filter.per_page"
        :page.sync="filter.page"
        :server-items-length="0"
        hide-default-footer
        class="balance-table"
      >
        <template #item.actions="{ item }">
          <el-button
            size="small"
            circle
            class="border-none"
            type="light"
            @click="openEditDialog(item)"
          >
            <img src="/img/edit.svg" alt="Edit" />
          </el-button>
          <el-button
            size="small"
            circle
            type="light"
            class="border-none"
            @click="openDeleteDialog(item)"
          >
            <img src="/img/delete.svg" alt="Delete" />
          </el-button>
        </template>
      </v-data-table>
    </div>
    <!-- 🔹 Create/Edit Dialog -->
    <el-dialog
      v-model="isFormDialog"
      :title="form.id ? 'Редактировать SIP' : 'Добавить SIP'"
    >
      <el-form :model="form" label-position="top" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Имя">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Хостинг">
              <el-input v-model="form.endpoint" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Логин">
              <el-input v-model="form.username" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Количество каналов">
              <el-input v-model.number="form.channel_count" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Пароль">
              <el-input v-model="form.password" type="password" show-password />
            </el-form-item>
          </el-col>
        </el-row>       
      </el-form>
      <template #footer>
        <el-button 
          class="cancel-button" 
          @click="isFormDialog = false"
        > 
          Отмена
        </el-button>
        <el-button 
          type="primary" 
          class="add-button" 
          @click="handleSave"
        >
          {{ form.id ? 'Редактировать' : 'Добавлять' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 🔹 Delete Dialog -->
    <el-dialog
      v-model="isDeleteDialog"
      title="Подтвердите удаление"
      width="400px"
    >
      <span>Вы хотите удалить {{ deleteTarget?.name }}?</span>
      <template #footer>
        <el-button @click="isDeleteDialog = false">Нет</el-button>
        <el-button type="danger" @click="confirmDelete">Да, удалить.</el-button>
      </template>
    </el-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useSipStore } from "@/stores/sip";

const sipStore = useSipStore();

const loading = ref(false);
const rows = ref<any[]>([]);
const filter = ref({
  per_page: 10,
  page: 1,
})

const isFormDialog = ref(false);
const isDeleteDialog = ref(false);
const deleteTarget = ref<any>(null);

const form = reactive({
  id: null,
  name: "",
  endpoint: "",
  username: "",
  password: "",
  channel_count: 1,
});

const headers = [
  { title: "ID", key: "id" },
  { title: "Имя", key: "name" },
  { title: "Конечная точка", key: "endpoint" },
  { title: "Имя пользователя", key: "username" },
  { title: "Количество каналов", key: "channel_count" },
  { title: "Статус", key: "status_ru" },
  { title: "Действия", key: "actions", sortable: false },
];

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await sipStore.index({});
  } finally {
    loading.value = false;
  }
};

const openCreateDialog = () => {
  resetForm();
  isFormDialog.value = true;
};

// 🔹 Edit
const openEditDialog = (item: any) => {
  Object.assign(form, item);
  isFormDialog.value = true;
};

// 🔹 Save (Create/Update)
const handleSave = async () => {
  loading.value = true;
  try {
    if (form.id) {
      await sipStore.update(form);
    } else {
      await sipStore.create(form);
    }
    isFormDialog.value = false;
    fetchData();
  } finally {
    loading.value = false;
  }
};

// 🔹 Delete
const openDeleteDialog = (item: any) => {
  deleteTarget.value = item;
  isDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (!deleteTarget.value) return;
  console.log('Deleting SIP with ID:', deleteTarget.value.uuid); // Debugging line
  loading.value = true;
  try {
    await sipStore.destroy(deleteTarget.value.uuid);
    isDeleteDialog.value = false;
    fetchData();
  } finally {
    loading.value = false;
  }
};

// 🔹 Reset form
const resetForm = () => {
  Object.assign(form, {
    id: null,
    name: "",
    endpoint: "",
    username: "",
    password: "",
    channel_count: 1,
  });
};

onMounted(fetchData);
</script> 
<style>
.add-button {
  background-color: #2563EB;
  color: #fff;
  border-radius: 50px;
  padding: 20px 25px;
  font-size: 16px;
  font-weight: 500;
}
.cancel-button {
  border: none;
  background-color: #fff;
  color: #333;
  padding: 20px 25px;
  font-size: 16px;
  font-weight: 500;
}
.el-input__wrapper
{
  border-radius: 16px !important;
  padding: 10px 12px !important;
}
</style>