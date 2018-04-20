<template>
    <div class="fs-formpro__rule">
        <template v-if="ready">
            <div class="rule-section" v-for="(sec, i) in data" :key="i">
                <div class="rule-sec-hd">{{sec.label}}<span> {{sec.desc}}</span></div>
                <div class="rule-sec-bd">
                    <div class="rule-item" v-for="(item, j) in sec.items" :key="j">
                        <span class="rule-item-tit">{{item.key}}</span>
                        <span class="rule-item-con">{{item.value}}</span>
                    </div>
                </div>
            </div>
        </template>
        <exception :status="pgStatus" :errMsg="errMsg" :errCode="errCode" :full-screen="loadingFullScreen"></exception>
    </div>
</template>
<script>
    import baseMixin from 'mixins/baseMixin';
    import ApiService from 'api/ApiService';
    import { lite } from 'lib';
    // import mock from 'mock/rule.json';
    
    export default {
        mixins: [baseMixin],
        methods: {
            init() {
                this.fetch();
            },
            fetch() {
                if (!this.initStatus()) return;

                const opts = lite.extend({
                    formDescribeId: this.formDescribeId,
                }, this.proxyApiOpts);

                ApiService.querySubmitRule(opts)
                .then((resp) => {
                    if (resp.errCode == 0) {
                        Jsapi.setTitle(resp.data.formName || '上报规则');
                        this.operateData(resp.data);
                    }
                    this.updateStatus(resp, this.total);
                })
                .catch((error) => {
                    console.debug('querySubmitRule error:', error);
                    this.updateStatus(error);
                });
            },
            operateData(data) {
                const sectionMaps = {
                    'nowSubmitRule': '当前规则',
                    'nextSubmitRule': '待生效规则',
                };
                const cData = [];
                for (const key in data) {
                    if (_.keys(sectionMaps).indexOf(key) !== -1) {
                        let desc = '';
                        if (key == 'nextSubmitRule') desc = lite.formatDate(data.validTime, '(MM月dd日 hh:mm生效)');
                        cData[_.keys(sectionMaps).indexOf(key)] = {
                            label: sectionMaps[key],
                            desc,
                            items: data[key],
                        };
                    }
                }
                this.data = cData;
                this.total = data.nowSubmitRule.length === 0 && data.nextSubmitRule.length === 0 ? 0 : 1;
            },
        },
        data() {
            return {
                data: [],
                total: 0,
            };
        },
        mounted() {
            this.init();
        },
    };
</script>
<style lang="less">
.fs-formpro__rule {
    .rule-sec-hd {
        padding-left: 12px;
        font-size: 12px;
        color: #999;
        line-height: 36px;
    }
    .rule-sec-bd {
        padding: 20px 12px;
        background-color: #fff;
        font-size: 14px;
        .rule-item {
            display: flex;
            justify-content: flex-start;
            padding-top: 12px;
            &:first-of-type {
                padding-top: 0;
            }
        }
        .rule-item-tit {
            flex: 0 0 auto;
            color: #999;
        }
        .rule-item-con {
            padding-left: 35px;
            color: #333;
        }
    }
}
</style>