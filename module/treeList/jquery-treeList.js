/**
 * 树状图
 * @param  {[type]} opts [description]
 *     cb         回调函数，传递改变checkBox的state和value
 *     opts.data  树状图数据
 *     opts.key   配置数据中对象的键值
 *       opts.key.name      checkbox后面说明文字对应的键
 *       opts.key.value     checkbox的value对应的键
 *       opts.key.children  checkbox子项对应的键
 */
$.fn.treeList = function(opts, cb) {
    // 默认配置
    var def = {
        key: {
            name: 'name',
            value: 'value',
            children: 'children'
        }
    };
    var config = $.extend({}, def, opts);
    // 初始化树状图
    var initList = function(parent, data, key) {
        for (var i = 0, j = data.length; i < j; i++) {
            var da = data[i];
            var child = $('<li><input type="checkbox" value="' + da[key.value] + '"/><span class="treeListTitle">' + da[key.name] + '</span></li>');
            if (da[key.children]) {
                var ul = $('<ul></ul>');
                child.append(ul);
                initList(ul, da[key.children], key);
            }
            parent.append(child);
        }
    }
    return this.each(function(index, el) {
        var $this = $(this);
        var data = config.data;
        initList($this, data, config.key);
        $this.on('click', '.treeListTitle', function() {
            $(this).next().slideToggle();
        });
        $this.on('change', 'input', function() {
            var _this = $(this);
            var result = [];
            if (this.value && this.value !== 'undefined') {
                result.push({
                    state: this.checked,
                    value: this.value
                });
            }
            if (this.checked) {
                // 子项全选
                _this.parent().children('ul').find('input').each(function(index, el) {
                    // 取改变的值
                    if (!el.checked) {
                        $(el).prop('checked', true);
                        if (el.value && el.value !== 'undefined') {
                            result.push({
                                state: true,
                                value: el.value
                            });
                        }
                    }
                });
                // _this.parent().children('ul').find('input').prop('checked', true);
                // _this.parent().children('ul').find('input').trigger('click');
                // 判断上级是否全选
                var state = true;
                _this.parent().siblings().each(function(index, el) {
                    var ipt = $(el).children('input')[0];
                    if (!ipt.checked) {
                        state = false;
                    }
                });
                if (state) {
                    // _this.parent().parent().parent().children('input').prop('checked', true);
                    // 使用prop改变checked值无法触发change事件
                    _this.parent().parent().parent().children('input').trigger('click');
                }
            } else {
                // 子项全选取消
                _this.parent().children('ul').find('input').each(function(index, el) {
                    // 取改变的值
                    if (el.checked) {
                        $(el).prop('checked', false);
                        if (el.value && el.value !== 'undefined') {
                            result.push({
                                state: false,
                                value: el.value
                            });
                        }

                    }
                });
                // _this.parent().children('ul').find('input').prop('checked', false);
                // _this.parent().children('ul').find('input').trigger('click');
                // 上级全选取消
                _this.parentsUntil($this).children('input').prop('checked', false);
                // _this.parentsUntil($this).children('input').trigger('click');
            }
            // 子项全选时，上级旋转框勾选时，会手动触发change事件，此时result为空数组
            if(result.length < 1) return;
            cb(result);
        });
    });
}