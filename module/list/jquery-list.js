/**
 * 填充列表
 * @param  {Object} opts [配置]
 *                       opts.url			String		请求地址
 *                       opts.arg			Object		请求参数
 *                       opts.reqType		String		请求方式，默认POST
 *                       opts.done 			Function    渲染每一条数据时执行
 *                       opts.removeNull	Boolean		是否移除值为''、null、undefined的dom的父元素，默认为false。(ps：当使用nullText时，该值必须为false)
 *                       opts.nullText		String 		当值为'',null,undefined时，显示的替换文本，默认为空
 *                       opts.paging		Boolean		是否开启分页，默认false
 *                       opts.page 			Object		分页配置
 *                       	opts.page.count			String 		数据总数字段，默认count
 *                        	opts.page.limit			Number		每页数据量，默认10
 *                        	opts.page.pageBtnNum	Number		页码按钮数量，默认5
 *                        	opts.page.btns			Array		分页功能按钮，首页、上一页、下一页、尾页、跳页
 *                         	opts.page.jump			Function 	跳页时的执行
 * @return {[type]}      [description]
 */
$.fn.list = function(opts) {
	var def = {
		reqType: 'POST',
		removeNull: false,
		nullText: '空',
		paging: false,
		page: {
			count: 'count',
			limit: 10,
			pageBtnNum: 5,
			bts: ['first', 'prev', 'next', 'last', 'jump']
		}
	};
	var config = $.extend({}, def, opts);
	var $this = $(this);
	var tpl = $this.find('.tpl');
	var listRender = {
		init: function(arg){
			$.ajax({
				url: config.url,
				type: config.reqType,
				dataType: 'json',
				data: arg,
			})
			.done(function(data) {
				
			});
		},
		render: function(data) {
			$this.empty().append(tpl);
			// 遍历列表数据
			for (var i = 0, j = data.length; i < j; i++) {
				var liData = data[i],
					li = tpl.clone().removeAttr('class'),
					elems = li.find('[data-name]');
				// 遍历需要填充数据的dom
				for (var n = 0, m = elems.length; n < m; n++) {
					var elem = elems.eq(n),
						keyArr = elem.attr('data-name').split(' '),
						val = liData[keyArr[0]];
					// 多层嵌套数据
					if (keyArr.length > 1) {
						// 遍历多层嵌套数据
						for (var k = 1, l = keyArr.length; k < l; k++) {
							val = val[keyArr[k]];
						}
					}
					// 当值为空时
					if (val === '' || val === null || val === undefined) {
						if (config.removeNull) {
							elem.parent().remove();
						} else {
							val = config.nullText;
							elem.html(val);
						}
					} else {
						elem.html(val);
					}
				}
				$this.append(li);
				// 填充列表时，其他操作
				if (config.fn) {
					config.fn(liData);
				}
			}
		},

	};
}