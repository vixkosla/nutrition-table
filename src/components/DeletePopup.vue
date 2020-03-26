<template>
  <div class="delete">
    <div class="delete-text">
      Are you sure you want to <span>delete item</span>?
    </div>
    <div class="delete-buttons">
      <div v-on:click="decision('no')" class="button_cancel">
        Cancel
      </div>
      <div v-on:click="decision('yes')" class="button_confirm">Confirm</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false
    };
  },
  props: {
    // product: {
    //   type: Object
    // },
    // index: {
    //   type: Number,
    //   default: null
    // }
  },
  methods: {
    decision(answer) {
      this.$emit("decision", answer);
    }
  }
};
</script>

<style scoped lang="scss">
.delete {
  // top: 500px;
  // left: 500px;
  position: absolute;
  width: 96px;
  height: 254px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  line-height: 24px;
  width: 254px;
  height: 96px;

  &-text {
    margin: 16px 16px 8px 16px;

    span {
      font-weight: 600;
    }
  }

  &-buttons {
    display: flex;
    justify-content: center;
  }
}

.button {
  &_cancel {
    border: 1px solid #c6cbd4;
    padding: 3px 18px 5px 17px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
  }

  &_confirm {
    padding: 3px 18px 5px 17px;
    border-radius: 4px;
    color: white;
    background-color: #00a11e;
    cursor: pointer;
  }
}
</style>
