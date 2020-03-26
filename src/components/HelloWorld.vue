<template>
  <div class="table">
    <div class="table-panel">
      <!-- sorting filter panel -->
      <div class="table-panel_sort">
        <ul>
          <li>Sorting by:</li>
          <li
            v-for="(name, index) in columnsAllNames"
            v-bind:key="index"
            v-on:click="pickSortingProperty(index)"
            v-bind:class="{
              'selected-sort-property ': columns[index].sort
            }"
          >
            {{ name }}
          </li>
        </ul>
      </div>
      <!-- delete button -->
      <div
        class="table-panel_delete"
        v-bind:class="{ 'active-delete-button': deleteButtonCounter }"
        v-on:click="deleteSelectedProducts()"
      >
        Delete{{ deleteButtonCounter }}
      </div>
      <!-- page pagination option selector -->
      <div class="table-panel_page">
        <page-selector v-bind:pagination.sync="pagination"></page-selector>
      </div>
      <!-- page pagination orientation panel -->
      <div class="table-panel_pagination">
        <div
          class="pagination_arrow_left"
          v-bind:class="{ 'active-arrows': paginationStartPosition }"
          v-on:click="previousPage()"
        >
          <img src="@/assets/icons/arrow-left.svg" />
        </div>
        <div class="pagination_display">
          {{ paginationStartPosition }} - {{ paginationEndPosition }}
          <span>of</span>
          {{ this.$store.getters.getLengthOfProducts }}
        </div>
        <div
          class="pagination_arrow_right"
          v-bind:class="{ 'active-arrows': paginationEndPosition }"
          v-on:click="nextPage()"
        >
          <img src="@/assets/icons/arrow-right.svg" />
        </div>
      </div>
      <!-- columns selector filter panel -->
      <div class="table-panel_columns_selector">
        <columns-selector v-bind:columns.sync="columns"></columns-selector>
      </div>
    </div>
    <!-- table with filtered output -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th v-on:click="toogleAll()">
              <img v-show="selectAll" src="@/assets/icons/checkbox-done.svg" />
              <img v-show="!selectAll" src="@/assets/icons/checkbox.svg" />
            </th>
            <th
              v-for="(column, index) in columnSelectedNames"
              v-bind:key="index"
              v-bind:class="sortColumnClass"
              v-on:click="sortOrderHandler()"
            >
              {{ column }}
              <!-- <img src="@/assets/icons/down.svg" /> -->
            </th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, index) in items" v-bind:key="index">
            <td v-on:click="selectItem(index)">
              <img
                v-show="row.selected"
                src="@/assets/icons/checkbox-done.svg"
              />
              <img v-show="!row.selected" src="@/assets/icons/checkbox.svg" />
            </td>
            <!-- <div></div> -->
            <td
              v-for="(value, indexOfValue) in row.items"
              v-bind:key="indexOfValue"
              v-on:click="selectForDelete(index)"
            >
              {{ value }}
            </td>

            <td>
              <div
                v-show="row.deleted"
                v-on:click="showWarningForDelete(index)"
              >
                <img src="@/assets/icons/cart.svg" />delete
              </div>
              <delete-popup
                v-if="row.warning"
                v-on:decision="handlerWarning($event, index)"
              ></delete-popup>
              <!-- <img v-show="!selectAll" src="@/assets/icons/checkbox.svg" /> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ColumnsSelector from "@/components/ColumnsSelector.vue";
import PageSelector from "@/components/PageSelector.vue";
import DeletePopup from "@/components/DeletePopup.vue";
// defens from stupid jork whoes trying delete/unselect last column

export default {
  name: "HelloWorld",
  components: {
    ColumnsSelector,
    PageSelector,
    DeletePopup
  },
  props: {
    msg: String
  },
  data() {
    return {
      // fetching parameters
      loading: false,
      loaded: false,
      error: "",
      // data
      data: [],
      items: [],
      // filter parameters/columns
      columns: [
        {
          id: 1,
          value: "product",
          name: "Product (100g serving)",
          visible: true,
          sort: false
        },
        {
          id: 2,
          value: "calories",
          name: "Calories",
          visible: true,
          sort: false
        },
        {
          id: 3,
          value: "fat",
          name: "Fat (g)",
          visible: true,
          sort: false
        },
        {
          id: 4,
          value: "carbs",
          name: "Carbs (g)",
          visible: true,
          sort: false
        },
        {
          id: 5,
          value: "protein",
          name: "Protein (g)",
          visible: true,
          sort: false
        },
        {
          id: 6,
          value: "iron",
          name: "Iron (%)",
          visible: true,
          sort: false
        }
      ],

      // pagination options
      totalPages: null,
      currentPage: 1,
      pagination: [
        {
          value: 10,
          selected: true
        },
        {
          value: 15,
          selected: false
        },
        {
          value: 20,
          selected: false
        }
      ],
      // selectedForDelete: false
      // sorting order
      order: "",
      sortColumnClass: {
        "active-sort-property_descending": false,
        "active-sort-property_ascending": false,
        "active-sort-property": false
      }
    };
  },
  watch: {
    perPage: function() {
      this.paginationSetup();
    },
    selectedItems: function() {
      this.$set(this, "items", this.selectedItems);
    },
    sortIndex: function(value) {
      Object.keys(this.sortColumnClass).forEach(
        el => (this.sortColumnClass[`${el}`] = false)
      );

      console.log("check watch sort index");

      if (value !== -1) {
        this.sortColumnClass["active-sort-property"] = true;
      }
    }
  },
  computed: {
    deleteButtonCounter() {
      const temp = this.items.filter(el => el.selected).length;
      return temp ? ` (${temp})` : "";
    },
    selectAll() {
      return !this.items.filter(el => !el.selected).length;
    },
    perPage() {
      return this.pagination.find(el => el.selected).value;
    },
    columnsAllNames() {
      return this.columns.map(el => el.name);
    },
    columnSelectedNames() {
      let temp = [];

      // selected columns
      temp = this.columns
        .filter(el => el.visible && !el.sort)
        .map(el => el.name);

      // paste to beginning sort column
      let sortIndex = this.columns.findIndex(el => el.sort);
      if (sortIndex !== -1) {
        temp.unshift(this.columns[sortIndex].name);
      }

      return temp;
    },
    columnSelectedValues() {
      let temp = [];

      temp = this.columns
        .filter(el => el.visible && !el.sort)
        .map(el => el.value);

      let sortIndex = this.columns.findIndex(el => el.sort);
      if (sortIndex !== -1) {
        temp.unshift(this.columns[sortIndex].value);
      }

      return temp;
    },
    selectedItems() {
      if (this.$store.getters.getStatus) {
        const temporaryArray = [];
        // page pagination
        let start = this.paginationStartPosition;
        let end = this.paginationEndPosition;

        for (let i = start; i < end; i++) {
          temporaryArray.push(this.$store.getters.getProducts[i]);
        }

        // selected picked values
        const temporaryArrayOfObjects = temporaryArray.map(element => {
          let temporaryElement = [];

          for (const property of this.columnSelectedValues) {
            temporaryElement.push(element[`${property}`]);
          }

          return {
            id: element.id,
            items: temporaryElement,
            selected: false,
            deleted: false,
            warning: false
          };
        });

        // sort array
        let sortIndex = this.columns.findIndex(el => el.sort);

        if (sortIndex !== -1) {
          console.log("start code of sorting");

          let ascending, descending, expression;

          if (this.columns[sortIndex].id === 1) {
            ascending = (a, b) => a.items[0].localeCompare(b.items[0]);
            descending = (a, b) => b.items[0].localeCompare(a.items[0]);
          } else {
            ascending = (a, b) => a.items[0] - b.items[0];
            descending = (a, b) => b.items[0] - a.items[0];
          }

          if (this.order === "возростание") {
            expression = ascending;
            temporaryArrayOfObjects.sort(expression);
          } else if (this.order === "убывание") {
            expression = descending;
            temporaryArrayOfObjects.sort(expression);
          }
        }

        return temporaryArrayOfObjects;
      } else {
        this.$set(this, "items", []);
        return [];
      }
    },
    paginationStartPosition() {
      return this.perPage * (this.currentPage - 1);
    },
    paginationEndPosition() {
      return this.perPage * this.currentPage;
    },
    sortIndex() {
      return this.columns.findIndex(el => el.sort);
    }
  },
  async mounted() {
    await this.quasiFetchData();
    // this.prepareData();
    this.paginationSetup();
  },
  methods: {
    sortOrderHandler() {
      if (this.sortIndex !== -1) {
        Object.keys(this.sortColumnClass).forEach(
          el => (this.sortColumnClass[`${el}`] = false)
        );

        if (this.order === "возростание") {
          this.order = "убывание";
          this.sortColumnClass["active-sort-property_ascending"] = true;
        } else if (this.order === "убывание") {
          this.order = "возростание";
          this.sortColumnClass["active-sort-property_descending"] = true;
        } else {
          this.order = "возростание";
          this.sortColumnClass["active-sort-property_descending"] = true;
        }
      }
    },
    selectItem(index) {
      this.$set(this.items[index], "selected", !this.items[index].selected);
      // this.items[index].selected = !this.items[index].selected;
    },
    toogleAll() {
      let temp;

      if (this.selectAll) {
        temp = false;
      } else if (!this.selectAll) {
        temp = true;
      }

      for (const item of this.items) {
        item.selected = temp;
      }
    },
    selectForDelete(index) {
      let temp = this.items[index].deleted;
      this.items.forEach(item => this.$set(item, "deleted", false));
      this.items.forEach(item => this.$set(item, "warning", false));
      this.$set(this.items[index], "deleted", !temp);
      // console.log("piu");
    },
    deleteProduct(index) {
      this.$store.dispatch("deleteProduct", this.items[index].id);
      // console.log(`deleted item from id ${this.items[index].id}`);
    },
    deleteSelectedProducts() {
      const tempArray = this.items
        .filter(item => item.selected)
        .map(item => item.id);
      this.$store.dispatch("deleteProducts", tempArray);
    },
    handlerWarning(string, index) {
      if (string === "yes") {
        this.deleteProduct(index);
      } else if (string === "no") {
        this.hideWarningForDelete(index);
      }
    },
    showWarningForDelete(index) {
      this.items[index].warning = !this.items[index].warning;
      console.log(index);
    },
    hideWarningForDelete(index) {
      this.$set(this.items[index], "warning", false);
      console.log("HIDE");
      // this.items[index].warning = false;
    },
    paginationSetup() {
      this.totalPages = this.$store.getters.getLengthOfProducts / this.perPage;
      // console.log(this.$store.getters.getLengthOfProducts);
      this.currentPage = 1;
    },
    nextPage() {
      if (this.currentPage <= this.totalPages) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    toogleProperty(index) {
      if (this.columns[index].sort) {
        this.columns[index].sort = false;
        this.order = "";
      }

      this.columns[index].visible = !this.columns[index].visible;
    },
    pickSortingProperty(index) {
      if (this.columns[index].sort) {
        // case to off current sorting property
        this.columns[index].sort = false;
      } else {
        // shut off previous sort property
        // let sortPreviousIndex = this.columns.findIndex(el => el.sort);
        // if (sortPreviousIndex !== -1) {
        //   this.columns[sortPreviousIndex].visible = false;
        // }
        // set default values if current property is false
        for (const column of this.columns) {
          column.sort = false;
        }
        // pick proper column for sort and do column visible
        this.columns[index].sort = true;
        this.columns[index].visible = true;
      }
    },
    async quasiFetchData() {
      this.loading = true;

      // do {
      try {
        const data = await this.$getProducts();
        this.$store.commit("setProducts", data);
      } catch (error) {
        console.log(error);
        alert(
          `this time you have bad luck, page will reloads after press okey`
        );
        window.location.reload(true);
      }

      this.loading = false;
    },
    prepareData() {
      // this.data = this.$store.getters.getProducts;
      // console.log();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.table {
  z-index: 1;
  position: relative;

  &-panel {
    display: flex;
    font-size: 14px;
    height: 64px;
    align-items: center;

    &_sort {
      flex-grow: 1;

      > ul {
        text-align: left;
      }

      li:nth-child(1) {
        cursor: default;
        font-weight: 600;
        padding-left: 0;
      }

      li {
        text-align: left;
        padding: 3px 8px 5px 8px;
        margin: 0;
        cursor: pointer;
        line-height: 24px;
      }
    }

    &_delete {
      cursor: default;
      border: 1px solid #d5dae0;
      color: #d5dae0;
      width: 72px;
      box-sizing: border-box;
      border-radius: 2px;
      margin-right: 12px;
      // display: flex;
      padding: 3px 10px 3px 11px;
      line-height: 24px;
      // box-sizing: content-box;
    }

    &_pagination {
      display: flex;
      // justify-content: center;
      align-items: center;
      margin: 0 16px;
      font-weight: 600;
    }
  }
}

.pagination {
  &_display {
    // box-sizing: border-box;
    line-height: 24px;
    padding: 0;
    width: 104px;
    box-sizing: border-box;
    cursor: default;

    & > span {
      font-weight: normal;
    }
  }

  &_arrow_left,
  &_arrow_right {
    cursor: pointer;
    display: flex;
    border: 1px solid #d5dae0;
    padding: 3px;
    border-radius: 2px;
    opacity: 0.4;
  }
}

.active-delete-button {
  border: 1px solid #00a11e;
  color: white;
  background-color: #00a11e;
  cursor: pointer;
  width: 86px;
}

.active-arrows {
  border: 1px solid #c6cbd4;
  opacity: 1;
}

.selected-sort-property {
  color: white;
  background-color: #00a11e;
  border-radius: 2px;
}

delete-popup {
  position: relative;
  left: -50px;
}

//mixin ?

.active-sort-property {
  &:nth-of-type(2) {
    color: #00a11e;
  }
}

.active-sort-property_descending {
  &:nth-of-type(2) {
    padding-top: 4px;
    color: #00a11e;
    vertical-align: middle;
    height: 100%;

    &::after {
      content: url("../assets/icons/down.svg");
      vertical-align: middle;
      height: 24px;
      display: inline-block;
    }
  }
}

.active-sort-property_ascending {
  &:nth-of-type(2) {
    padding-top: 4px;
    color: #00a11e;
    vertical-align: middle;
    height: 100%;
    &::after {
      content: url("../assets/icons/up.svg");
      vertical-align: middle;
      height: 24px;
      display: inline-block;
    }
  }
}

.table {
  z-index: inherit;
}

.selector {
  position: relative;
  z-index: 2;
}

.table-container {
  background-color: white;

  > table {
    border-collapse: collapse;
    width: 100%;
    line-height: 24px;
    font-size: 14px;
    > thead {
      > tr {
        > th {
          height: 55px !important;

          font-weight: 600;
          box-sizing: border-box;

          border-bottom: 0.5px solid #ededed;
        }
      }
    }

    > thead,
    > tbody {
      > tr {
        // display: flex;
        // justify-content: center;
        > th {
          min-width: 100px;
        }
        > th,
        > td {
          padding-right: 30px;

          // flex: auto;
          // flex-basis: auto;
          text-align: left;
          // width: 170px;
          height: 47px;
          // box-sizing: content-box;
          max-width: 150px;

          &:first-child {
            width: 80px;
            box-sizing: border-box;
            // display: flex;
            // margin: 0;
            justify-content: center;

            text-align: center;
            min-width: 50px;
            padding-right: 0;
            padding-left: 15px;
            padding-right: 10px;
            margin: 5px 0;
            height: 100%;
            vertical-align: middle;

            > img {
              height: 14px;
              vertical-align: middle;
            }
          }
        }

        > td,
        > th {
          &:first-child {
            > img {
              &:last-child {
                width: 24px;
                height: 24px;
              }
            }
          }

          &:last-child {
            > div {
              cursor: pointer;
            }
            // display: flex;
            // justify-content: center;
            // align-items: center;
            text-align: center;
            padding-right: 2px;
            box-sizing: content-box;
            line-height: 14px;
            img {
              // margin: auto 0;
              // height: 100%;
              vertical-align: middle;
              // margin: 0 auto;
              padding-right: 4px;
              padding-bottom: 4px;
            }
            // display: block;
            &:hover {
              // display: none;
            }
          }
        }

        &:nth-child(2n) {
        }

        &:hover {
        }
      }
    }

    tbody {
      > tr {
        cursor: pointer;
        &:nth-child(2n) {
          background-color: #f8f9fa;
        }

        &:hover {
          background-color: rgba(0, 161, 30, 0.07);
        }
      }
    }
  }
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
