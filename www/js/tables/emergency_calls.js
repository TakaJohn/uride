!function ($) {

  $(function(){
    
    // fuelux datagrid
    var DataGridDataSource = function (options) {
      this._formatter = options.formatter;
      this._columns = options.columns;
      this._delay = options.delay;
    };

    DataGridDataSource.prototype = {

      columns: function () {
        return this._columns;
      },

      data: function (options, callback) {
        var url = 'required.php?actions=client_emergency_calls';
        var self = this;

        setTimeout(function () {

          var data = $.extend(true, [], self._data);

          $.ajax(url, {
            dataType: 'json',
            async: false,
            type: 'GET'
          }).done(function (response) {

            data = response.data_array;
            // SEARCHING
            if (options.search) {
              data = _.filter(data, function (item) {
                var match = false;

                _.each(item, function (prop) {
                  if (_.isString(prop) || _.isFinite(prop)) {
                    if (prop.toString().toLowerCase().indexOf(options.search.toLowerCase()) !== -1) match = true;
                  }
                });

                return match;
              });
            }

            // FILTERING
            if (options.filter) {
              data = _.filter(data, function (item) {
                switch(options.filter.value) {
                  case 'lt5m':
                    if(item.population < 5000000) return true;
                    break;
                  case 'gte5m':
                    if(item.population >= 5000000) return true;
                    break;
                  default:
                    return true;
                    break;
                }
              });
            }

            var count = data.length;

            // SORTING
            if (options.sortProperty) {
              data = _.sortBy(data, options.sortProperty);
              if (options.sortDirection === 'desc') data.reverse();
            }

            // PAGING
            var startIndex = options.pageIndex * options.pageSize;
            var endIndex = startIndex + options.pageSize;
            var end = (endIndex > count) ? count : endIndex;
            var pages = Math.ceil(count / options.pageSize);
            var page = options.pageIndex + 1;
            var start = startIndex + 1;

            data = data.slice(startIndex, endIndex);

            if (self._formatter) self._formatter(data);

            callback({ data: data, start: start, end: end, count: count, pages: pages, page: page });
          }).fail(function(e){

          });
        }, self._delay);
      }
    };

    $('#emergency_calls_grid').each(function() {
      $(this).datagrid({
          dataSource: new DataGridDataSource({
          // Column definitions for Datagrid
          columns: [
          {
            property: 'name',
            label: 'Name',
            sortable: true
          },
          {
            property: 'time',
            label: 'Date/Time',
            sortable: true
          },
          {
            property: 'status',
            label: 'Status',
            sortable: true
          },
          {
            property: 'Respondent',
            label: 'respondent',
            sortable: true
          },
          {
            property: 'ID',
            label: 'View',
            sortable: true
          }
        ],

          // Create IMG tag for each returned image
          formatter: function (items) {
            $.each(items, function (index, item) {
              //item.ID = '<a href="emergency_call_details.php?ID='+item.ID+'"><i class="fa fa-edit"></i></a>';
              //item.ID = '<a href="emergency_call_details.php?ID='+item.ID+'"><i class="fa fa-trash-o"></i></a>';
              item.ID = '<a href="emergency_call_details.php?ID='+item.ID+'"><i class="fa fa-eye"></i></a>';
            });
          }
      })
      });
    });
    
  });
}(window.jQuery);