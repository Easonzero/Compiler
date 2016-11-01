/**
 * Created by eason on 16-11-1.
 */
angular.module('chart').factory('TreeChartFactory',function($window){
    let d3 = $window.d3;
    let factory = {};

    factory.render = function(element,root,height,width){
        d3.select(element).selectAll('*').remove();
        let curx=60,cury=0;
        let svg = d3.select(element).append('svg')
            .attr('height', height-20)
            .attr('width',width-20).call(
                d3.zoom().scaleExtent([1 / 2, 8]).on("zoom", ()=>{g.attr("transform", d3.event.transform);})
            ).call(
                d3.drag().on('start',()=>{
                    let sx = d3.event.x,
                        sy = d3.event.y,
                        dx=0,dy=0;
                    d3.event.on('drag', dragged);
                    function dragged(d) {
                        curx += d3.event.x-sx;
                        cury += d3.event.y-sy;
                        g.attr('transform', `translate(${curx},${cury})`);
                        sx=d3.event.x;
                        sy=d3.event.y;
                    }
                })
            );
        g = svg.append('g').attr('transform', `translate(${curx},${cury})`);

        let tree = d3.tree()
            .size([height-30, width-30]);

        let _node = d3.hierarchy(root);
        tree(_node);
        let links = _node.links();

        let link = g.selectAll('.link')
            .data(links)
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', function diagonal(d) {
                return 'M' + d.target.y + ',' + d.target.x
                    + 'C' + (d.source.y/2 + d.target.y/2) + ',' + d.target.x
                    + ' ' + (d.source.y/2 + d.target.y/2) + ',' + d.source.x
                    + ' ' + d.source.y + ',' + d.source.x;
            });

        let node = g.selectAll('.node')
            .data(_node.descendants())
            .enter().append('g')
            .attr('class', function(d) { return 'node' + (d.children ? ' node--internal' : ' node--leaf'); })
            .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; });

        node.append('circle').attr('r', 2.5);

        node.append('text')
            .attr('dy', 3)
            .attr('x', function(d) { return d.data.children.length!=0 ? -8 : 8; })
            .style('text-anchor', function(d) { return d.data.children!=0 ? 'end' : 'start'; })
            .text(function(d) { return d.data.name; });

    };

    return factory;
});