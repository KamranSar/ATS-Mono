<script>
  /**
   * This watermark is shown at the top left corner of the screen.
   * This watermark is NOT shown during production.
   *
   */
  export default {
    render: function (createElement) {
      let environment = '';
      if (this.$myApp.isLcl) {
        environment = 'LOCAL';
      } else if (this.$myApp.isDev) {
        environment = 'DEV';
      } else if (this.$myApp.isTst) {
        environment = 'TEST';
      } else if (this.$myApp.isPoc) {
        environment = 'POC';
      }

      let watermark = createElement('span', {
        domProps: {
          innerHTML: environment,
        },
      });

      const watermarkStyle = {
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none',
        display: 'flexbox',
        position: 'fixed',
        'z-index': 0,
        width: '8em',
        top: '0.8em',
        left: '-2.26em',
        'font-size': '0.73em',
        'font-weight': 'bolder',
        'text-align': 'center',
        transform: 'rotate(-45deg)',
      };
      const parentDiv = createElement('div', {
        class: {
          // Dynamically render the appropriate watermark for the environment
          watermark_lcl: this.$myApp.isLcl,
          watermark_dev: this.$myApp.isDev,
          watermark_tst: this.$myApp.isTst,
          watermark_poc: this.$myApp.isPoc,
        },
        style: watermarkStyle,
      });
      parentDiv.children = [watermark];
      return parentDiv;
    },
  };
</script>

<style scoped lang="scss">
  $lcl: #0198ff;
  $lcl-lighten: #599ecc;
  .watermark_lcl {
    color: #ffffff;
    background: $lcl;
    background: -webkit-linear-gradient(top left, $lcl, $lcl-lighten);
    background: -moz-linear-gradient(top left, $lcl, $lcl-lighten);
    background: linear-gradient(to bottom right, $lcl, $lcl-lighten);
  }

  $dev: #4caf50;
  $dev-lighten: #619463;
  .watermark_dev {
    color: #ffffff;
    background: $dev;
    background: -webkit-linear-gradient(top left, $dev, $dev-lighten);
    background: -moz-linear-gradient(top left, $dev, $dev-lighten);
    background: linear-gradient(to bottom right, $dev, $dev-lighten);
  }

  $tst: #ff9c07;
  $tst-lighten: #7e5f32;
  .watermark_tst {
    color: #ffffff;
    background: $tst;
    background: -webkit-linear-gradient(top left, $tst, $tst-lighten);
    background: -moz-linear-gradient(top left, $tst, $tst-lighten);
    background: linear-gradient(to bottom right, $tst, $tst-lighten);
  }

  $poc: #ff4a32;
  $poc-lighten: #d87c75;
  .watermark_poc {
    color: #ffffff;
    background: $poc;
    background: -webkit-linear-gradient(top left, $poc, $poc-lighten);
    background: -moz-linear-gradient(top left, $poc, $poc-lighten);
    background: linear-gradient(to bottom right, $poc, $poc-lighten);
  }
</style>
