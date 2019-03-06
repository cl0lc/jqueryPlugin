/**
 * 分页
 * @param  {Object} opts [description]
 *                       opts.count		Number	数据总数
 *                       opts.limit		Number	每页数据数量
 *                       opts.pageBtns  Number	页码个数
 *                       opts.btns      Array   按照指定顺序排列分页，first-首页，last-尾页，prev-上一页，page-页码，next-下一页，count-总数
 * @return {[type]}      [description]
 */
$.fn.paging = function(opts){
	var def = {
		limit: 5,
		pageBtns： 5,
		btns: ['first', 'prev', 'page', 'next', 'last']
	},
	config = $.extend({}, def, opts);
	return this.each(function(index, el) {
		var This = el,
			$this = $(el),
			btns = config.btns,
			count = config.count,
			limit = config.limit,
			pageBtns = config.pageBtns;

		var pageNumCount = Math.ceil(count/limit);

		// 添加首页、尾页等按钮
		for(var i = 0, j = bnts.length; i < j; i++){
			var btnName = btns[i];
			switch(btnName){
				case 'first':
					$this.append()
					break;
			}

		}

		// 当总页数小于页码个数
		
	});
}