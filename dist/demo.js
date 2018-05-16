
/* style */
import './demo.css';

/* script */
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

import baseMixin from 'mixins/baseMixin';
import ApiService from 'api/ApiService';
import { lite } from 'lib';
// import mock from 'mock/rule.json';

var __vue_script__ = {
    mixins: [baseMixin],
    methods: {
        init: function init() {
            this.fetch();
        },
        fetch: function fetch() {
            var _this = this;

            if (!this.initStatus()) return;

            var opts = lite.extend({
                formDescribeId: this.formDescribeId
            }, this.proxyApiOpts);

            ApiService.querySubmitRule(opts).then(function (resp) {
                if (resp.errCode == 0) {
                    Jsapi.setTitle(resp.data.formName || '上报规则');
                    _this.operateData(resp.data);
                }
                _this.updateStatus(resp, _this.total);
            }).catch(function (error) {
                console.debug('querySubmitRule error:', error);
                _this.updateStatus(error);
            });
        },
        operateData: function operateData(data) {
            var sectionMaps = {
                'nowSubmitRule': '当前规则',
                'nextSubmitRule': '待生效规则'
            };
            var cData = [];
            for (var key in data) {
                if (_.keys(sectionMaps).indexOf(key) !== -1) {
                    var desc = '';
                    if (key == 'nextSubmitRule') desc = lite.formatDate(data.validTime, '(MM月dd日 hh:mm生效)');
                    cData[_.keys(sectionMaps).indexOf(key)] = {
                        label: sectionMaps[key],
                        desc: desc,
                        items: data[key]
                    };
                }
            }
            this.data = cData;
            this.total = data.nowSubmitRule.length === 0 && data.nextSubmitRule.length === 0 ? 0 : 1;
        }
    },
    data: function data() {
        return {
            data: [],
            total: 0
        };
    },
    mounted: function mounted() {
        this.init();
    }
};

/* template */
var __vue_render__ = function __vue_render__() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "fs-formpro__rule" }, [_vm.ready ? _vm._l(_vm.data, function (sec, i) {
        return _c("div", { key: i, staticClass: "rule-section" }, [_c("div", { staticClass: "rule-sec-hd" }, [_vm._v(_vm._s(sec.label)), _c("span", [_vm._v(" " + _vm._s(sec.desc))])]), _vm._v(" "), _c("div", { staticClass: "rule-sec-bd" }, _vm._l(sec.items, function (item, j) {
            return _c("div", { key: j, staticClass: "rule-item" }, [_c("span", { staticClass: "rule-item-tit" }, [_vm._v(_vm._s(item.key))]), _vm._v(" "), _c("span", { staticClass: "rule-item-con" }, [_vm._v(_vm._s(item.value))])]);
        }))]);
    }) : _vm._e(), _vm._v(" "), _c("exception", {
        attrs: {
            status: _vm.pgStatus,
            errMsg: _vm.errMsg,
            errCode: _vm.errCode,
            "full-screen": _vm.loadingFullScreen
        }
    })], 2);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

var __vue_template__ = typeof __vue_render__ !== 'undefined' ? {
    render: __vue_render__,
    staticRenderFns: __vue_staticRenderFns__
} : {};

function __vue_normalize__(script, template) {
    if (!script.render) {
        script.render = template.render;
        script.staticRenderFns = template.staticRenderFns;
        script._compiled = true;
        if (functional) script.functional = true;
    }
}

export default __vue_normalize__(typeof __vue_script__ !== 'undefined' ? __vue_script__ : {}, __vue_template__);