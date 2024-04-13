<template>
  <vxe-toolbar>
    <template #buttons>
      <vxe-button style="margin-left: 20px" @click="toggleBorder()">切换边框</vxe-button>
      <vxe-button @click="toggleCellStyle()">切换单元格样式</vxe-button>
      <vxe-button @click="toggleCellSelectionStyle()">单元格选中</vxe-button>
      <vxe-button @click="toggleHeader()">切换Header显示</vxe-button>
      <vxe-button @click="toggleRadio()">开启/关闭单选功能</vxe-button>
      <vxe-button @click="toggleCheckbox()">开启/关闭多选功能</vxe-button>
    </template>
  </vxe-toolbar>
  <div class="card content-box">
    <!-- show-header：是否隐藏头部 -->
    <!-- 自定义提示内容：:tooltip-config="tooltipConfig" -->
    <!-- 列宽拖动：column-config.resizable -->
    <!-- 自定义起始号：:seq-config="seqConfig" -->
    <!-- 斑马线：stripe -->
    <!-- hover行高亮：:row-config="{ isCurrent: true, isHover: true }" -->
    <!-- border: 默认显示部分边框，设置border后显示完整边框。border="none"隐藏所有边框。round 圆角边框 -->
    <!-- header-cell-style/row-style/cell-style：设置单元格样式 -->
    <!-- cell-class-name/cell-click：单元格选中样式 -->
    <!-- radio-config: 单选框相关 -->
    <vxe-table
      stripe
      :row-config="{ isCurrent: true, isHover: true }"
      :column-config="{ isCurrent: true, isHover: true, resizable: true }"
      :radio-config="{ labelField: 'id', trigger: 'row', strict: false }"
      :checkbox-config="{ trigger: 'row' }"
      :show-header="showHeader"
      align="left"
      :tooltip-config="tooltipConfig"
      :seq-config="seqConfig"
      :border="border"
      round
      size="medium"
      height="85%"
      :data="tableData"
      class="table-style"
      :header-cell-style="headerCellStyle"
      :row-style="rowStyle"
      :cell-style="cellStyle"
      :cell-class-name="cellClassName"
      @cell-click="cellClickEvent"
    >
      <vxe-column v-if="showRadio" type="radio" width="120">
        <template #header>
          <span>自定义插槽</span>
        </template>
      </vxe-column>
      <vxe-column v-if="showCheckbox" type="checkbox" width="60"></vxe-column>
      <vxe-column type="seq" width="100"></vxe-column>
      <vxe-column
        field="name"
        title="姓名"
        :title-suffix="{ message: '自定义后缀', icon: 'vxe-icon-question-circle-fill' }"
        width="100"
      ></vxe-column>
      <vxe-column
        field="sex"
        title="性别"
        width="100"
        :formatter="formatterSex"
        sortable
        :filters="sexOptions"
        :filter-multiple="false"
      ></vxe-column>
      <vxe-column field="age" title="年龄" width="100"></vxe-column>
      <vxe-column field="idNo" title="身份证号" width="100"></vxe-column>
      <!-- 如果内容长度过长，默认会换行显示 -->
      <vxe-column field="email" title="电子邮件" width="100"></vxe-column>
      <!-- 添加show-overflow属性：如果内容长度过长会默认显示省略号，并通过原生的title进行hover提示 -->
      <vxe-column field="address" title="详细住址（家庭住址或者公司住址）" min-width="200" show-overflow="title"></vxe-column>
      <!-- show-header-overflow="title"属性：如果表头内容过长，通过hover提示 -->
      <vxe-column
        min-width="200"
        field="signature"
        title="个性签名（非常有个性的签名）"
        show-header-overflow="title"
        show-overflow="title"
        show-footer-overflow
      ></vxe-column>
    </vxe-table>
  </div>
</template>

<script setup lang="ts" name="useVXETable">
import { ref, reactive } from "vue";
import { VxeTablePropTypes, VxeTableEvents, VxeTableDefines, VxeColumnPropTypes } from "vxe-table";
import { ElNotification } from "element-plus";

const showHeader = ref(true);

interface RowVO {
  id: number;
  name: string;
  sex: string;
  age: number;
  idNo: string;
  address: string;
  email: string;
  signature: string;
}

const tableData = ref<RowVO[]>([
  {
    id: 10001,
    name: "杜静",
    sex: "0",
    age: 28,
    idNo: "186424293171036448",
    address: "云南省 普洱市",
    email: "p.dzplnulx@crev.de",
    signature: "想成为那种不声不响，但是什么都做得很好的人。"
  },
  {
    id: 10002,
    name: "郭刚",
    sex: "1",
    age: 22,
    idNo: "312728497861447544",
    address: "河南省 漯河市",
    email: "n.lpc@mighwyra.pw",
    signature: "优秀却不带优越感，明亮又不刺眼，自信又懂得收敛。"
  },
  {
    id: 10003,
    name: "雷洋",
    sex: "0",
    age: 32,
    idNo: "451374142590358280",
    address: "内蒙古自治区 巴彦淖尔市",
    email: "e.xzluc@qprbswgb.st",
    signature: "不去预知明天的烦恼，爱眼下具体的生活。"
  },
  {
    id: 10004,
    name: "徐君",
    sex: "0",
    age: 24,
    idNo: "122448606327173478",
    address: "新疆维吾尔自治区 乌鲁木齐市",
    email: "e.pkdjaq@efdftmuk.ht",
    signature: "自信到可以成为自己的光。"
  },
  {
    id: 10005,
    name: "沈明",
    sex: "0",
    age: 24,
    idNo: "130091846423506351",
    address: "江苏省 苏州市",
    email: "k.rstprb@hxuocmoz.gr",
    signature: "活在当下。"
  },
  {
    id: 10006,
    name: "曾杰",
    sex: "1",
    age: 24,
    idNo: "266626183872461563",
    address: "香港特别行政区 九龙",
    email: "i.zllc@bse.cy",
    signature: "拐个弯，与生活和解，得失都随意。"
  }
]);

// 切换边框
const border = ref<Boolean | String>("default");
const toggleBorder = () => {
  if (border.value === "default") {
    border.value = "none";
    ElNotification({
      title: "",
      message: "none: 隐藏所有边框",
      type: "success"
    });
  } else if (border.value === "none") {
    border.value = true;
    ElNotification({
      title: "",
      message: "true: 显示完整边框",
      type: "success"
    });
  } else if (border.value === true) {
    border.value = "outer";
    ElNotification({
      title: "",
      message: "outer: 显示外边框",
      type: "success"
    });
  } else if (border.value === "outer") {
    border.value = "inner";
    ElNotification({
      title: "",
      message: "inner: 显示内边框",
      type: "success"
    });
  } else if (border.value === "inner") {
    border.value = "default";
    ElNotification({
      title: "",
      message: "default: 默认边框设置",
      type: "success"
    });
  }
};

// 单元格样式
const showCellStyle = ref(false);
const toggleCellStyle = () => {
  showCellStyle.value = !showCellStyle.value;
  ElNotification({
    title: "",
    message: showCellStyle.value ? "显示单元格样式" : "隐藏单元格样式",
    type: "success"
  });
};

// 单选功能
const showRadio = ref(false);
const toggleRadio = () => {
  showRadio.value = !showRadio.value;
  ElNotification({
    title: "",
    message: showRadio.value ? "单选框功能开启" : "单选框功能关闭",
    type: "success"
  });
};

// 多选功能
const showCheckbox = ref(false);
const toggleCheckbox = () => {
  showCheckbox.value = !showCheckbox.value;
  ElNotification({
    title: "",
    message: showCheckbox.value ? "多选框功能开启" : "多选框功能关闭",
    type: "success"
  });
};

// 单元格选中
const showCellSelectionStyle = ref(false);
const toggleCellSelectionStyle = () => {
  showCellSelectionStyle.value = !showCellSelectionStyle.value;
  ElNotification({
    title: "",
    message: showCellSelectionStyle.value ? "开启单元格选中功能，请点击任一单元格" : "关闭单元格选中功能",
    type: "success"
  });
};

const toggleHeader = () => {
  showHeader.value = !showHeader.value;
  ElNotification({
    title: "",
    message: showHeader.value ? "显示Header" : "隐藏Header",
    type: "success"
  });
};

// 自定义hover提示内容
const tooltipConfig = reactive<VxeTablePropTypes.TooltipConfig<RowVO>>({
  showAll: true,
  enterable: true,
  contentMethod: ({ type, column, row, items, _columnIndex }) => {
    const { field } = column;
    // 重写默认的提示内容
    if (field === "name") {
      // type取值：header/body/footer
      if (type === "header") {
        return column.title ? "自定义标题提示内容：" + column.title : "";
      } else if (type === "footer") {
        return items[_columnIndex] ? "自定义表尾提示内容，\n并且自定义换行：\n" + items[_columnIndex] : "";
      }
      return row[field] ? "自定义提示内容：" + row[field] : "";
    } else {
      // 返回空字符串，控制单元格不显示提示内容
      return "";
    }
  }
});

// 表头过滤
const sexOptions = [
  { value: "0", label: "Women" },
  { value: "1", label: "Man" }
];
// 格式化内容
const formatterSex: VxeColumnPropTypes.Formatter<RowVO> = ({ cellValue }) => {
  const item = sexOptions.find(item => item.value === cellValue);
  return item ? item.label : cellValue;
};

// 自定义起始号
const seqConfig = reactive<VxeTablePropTypes.SeqConfig<RowVO>>({
  seqMethod({ rowIndex }) {
    return `NO${rowIndex + 1000}`;
  }
});

// 单元格样式
const headerCellStyle: VxeTablePropTypes.HeaderCellStyle<RowVO> = ({ column }) => {
  if (!showCellStyle.value) return null;
  if (column.field === "name") {
    return {
      backgroundColor: "#f60",
      color: "#ffffff"
    };
  }
};

const rowStyle: VxeTablePropTypes.RowStyle<RowVO> = ({ rowIndex }) => {
  if (!showCellStyle.value) return null;
  if ([2, 3, 5].includes(rowIndex)) {
    return {
      backgroundColor: "red",
      color: "#ffffff"
    };
  }
};

const cellStyle: VxeTablePropTypes.CellStyle<RowVO> = ({ row, column }) => {
  if (!showCellStyle.value) return null;
  if (column.field === "sex") {
    if (row.sex >= "1") {
      return {
        backgroundColor: "#187"
      };
    } else if (row.age === 26) {
      return {
        backgroundColor: "#2db7f5"
      };
    }
  }
};

// 点击cell添加颜色
const selectRow = ref<RowVO>();
const selectColumn = ref<VxeTableDefines.ColumnInfo<RowVO>>();
const cellClickEvent: VxeTableEvents.CellClick<RowVO> = ({ row, column }) => {
  selectRow.value = row;
  selectColumn.value = column;
};
const cellClassName: VxeTablePropTypes.CellClassName<RowVO> = ({ row, column }) => {
  // 设置cell点击
  if (showCellSelectionStyle.value) {
    if (row === selectRow.value && column === selectColumn.value) {
      return "col-orange";
    }
    return null;
  }
};
</script>

<style scoped lang="scss">
// 选中cell
::v-deep(.table-style.vxe-table .vxe-body--column.col-orange) {
  color: #fff;
  background-color: #f60;
}

// 全局样式调整
.vxe-toolbar {
  margin-bottom: 10px;
  border-radius: 6px;
}
.content-box {
  height: calc(100% - 70px);
}
</style>
