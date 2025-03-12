import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

/**
 * LineChart Component - Renders a responsive line chart using D3
 * 
 * @param {Object} props Component props
 * @param {Array} props.data Array of data objects
 * @param {string} props.xKey Key name for x-axis values in data objects
 * @param {Array} props.yKeys Array of key names for y-axis values
 * @param {Array} props.colors Array of colors for each line
 * @param {Array} props.labels Array of labels for each line
 * @param {Function} props.formatX Function to format x-axis labels
 * @param {Function} props.formatY Function to format y-axis labels
 * @param {boolean} props.showGrid Whether to show grid lines
 * @param {boolean} props.showLegend Whether to show legend
 * @param {boolean} props.showTooltip Whether to show tooltip on hover
 * @param {number} props.animationDuration Animation duration in ms
 */
const LineChart = ({
  data = [],
  xKey = 'x',
  yKeys = ['y'],
  colors = ['#e62d2d', '#3b82f6', '#10b981', '#f59e0b'],
  labels = [],
  formatX = (d) => d,
  formatY = (d) => d,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  animationDuration = 750
}) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Set chart dimensions on mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Draw chart when data or dimensions change
  useEffect(() => {
    if (!svgRef.current || !data.length || !dimensions.width || !dimensions.height) return;
    
    const svg = d3.select(svgRef.current);
    
    // Clear previous chart
    svg.selectAll('*').remove();
    
    // Chart dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;
    
    // Create chart group
    const chart = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const xScale = d3.scalePoint()
      .domain(data.map(d => d[xKey]))
      .range([0, width])
      .padding(0.5);
    
    const yMax = d3.max(data, d => Math.max(...yKeys.map(key => d[key] || 0)));
    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.1]) // Add 10% padding at the top
      .range([height, 0]);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(formatX);
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(formatY);
    
    // Add x-axis
    chart.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#9ca3af') // text-gray-400
      .attr('dy', '0.5em');
    
    // Add y-axis
    chart.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#9ca3af'); // text-gray-400
    
    // Style axes
    svg.selectAll('.domain')
      .attr('stroke', '#374151'); // border-gray-700
    
    svg.selectAll('.tick line')
      .attr('stroke', '#374151'); // border-gray-700
    
    // Add grid lines
    if (showGrid) {
      chart.append('g')
        .attr('class', 'grid-lines')
        .selectAll('line')
        .data(yScale.ticks(5))
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('y1', d => yScale(d))
        .attr('x2', width)
        .attr('y2', d => yScale(d))
        .attr('stroke', '#374151') // border-gray-700
        .attr('stroke-dasharray', '2,2')
        .attr('stroke-width', 0.5);
    }
    
    // Create line generator
    const line = d3.line()
      .x(d => xScale(d[xKey]))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    // Add lines for each y-key
    yKeys.forEach((key, i) => {
      const color = colors[i % colors.length];
      const lineData = data
        .map(d => ({
          [xKey]: d[xKey],
          value: d[key] || 0
        }))
        .filter(d => d.value !== null && d.value !== undefined);
      
      // Add line path
      const path = chart.append('path')
        .datum(lineData)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', line);
      
      // Animate line
      if (animationDuration > 0) {
        const pathLength = path.node().getTotalLength();
        
        path.attr('stroke-dasharray', pathLength)
          .attr('stroke-dashoffset', pathLength)
          .transition()
          .duration(animationDuration)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0);
      }
      
      // Add data points
      const points = chart.selectAll(`.point-${i}`)
        .data(lineData)
        .enter()
        .append('circle')
        .attr('class', `point-${i}`)
        .attr('cx', d => xScale(d[xKey]))
        .attr('cy', d => yScale(d.value))
        .attr('r', 0)
        .attr('fill', color)
        .attr('stroke', '#1f2937') // bg-gray-800
        .attr('stroke-width', 2);
      
      // Animate points
      points.transition()
        .delay((d, i) => i * (animationDuration / data.length))
        .duration(animationDuration / 2)
        .attr('r', 4);
      
      // Add tooltip events to points
      if (showTooltip) {
        const tooltip = d3.select(tooltipRef.current);
        
        points.on('mouseover', function(event, d) {
          const [x, y] = d3.pointer(event, this);
          
          d3.select(this)
            .transition()
            .duration(100)
            .attr('r', 6);
          
          tooltip
            .style('display', 'block')
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 30}px`)
            .html(`
              <div class="text-xs font-medium">
                <div>${formatX(d[xKey])}</div>
                <div class="flex items-center">
                  <span class="w-2 h-2 rounded-full mr-1" style="background-color: ${color}"></span>
                  <span>${labels[i] || key}: ${formatY(d.value)}</span>
                </div>
              </div>
            `);
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(100)
            .attr('r', 4);
          
          tooltip.style('display', 'none');
        });
      }
    });
    
    // Add legend
    if (showLegend && yKeys.length > 1) {
      const legend = chart.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 120}, 0)`);
      
      yKeys.forEach((key, i) => {
        const color = colors[i % colors.length];
        const label = labels[i] || key;
        
        const legendItem = legend.append('g')
          .attr('transform', `translate(0, ${i * 20})`);
        
        legendItem.append('rect')
          .attr('width', 12)
          .attr('height', 12)
          .attr('rx', 6)
          .attr('fill', color);
        
        legendItem.append('text')
          .attr('x', 20)
          .attr('y', 10)
          .attr('font-size', '12px')
          .attr('fill', '#9ca3af') // text-gray-400
          .text(label);
      });
    }
  }, [data, xKey, yKeys, colors, labels, formatX, formatY, showGrid, showLegend, showTooltip, animationDuration, dimensions]);
  
  return (
    <div className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full"></svg>
      
      {/* Tooltip */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute hidden bg-gray-900 text-white p-2 rounded shadow-lg border border-gray-700 z-10 pointer-events-none"
        ></div>
      )}
    </div>
  );
};

export default LineChart;