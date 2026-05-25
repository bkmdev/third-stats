<template>
<div class="chart">
	<h2 v-if="title" class="text-center">{{ title }}</h2>
	<p v-if="description" class="text-gray text-center">{{ description }}</p>
	<div class="chart-container">
		<canvas :id="id"></canvas>
	</div>
</div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { Chart, transparentGradientBar } from '@/chart.config.js';

let chart = null;
const id = Math.random().toString(36).substring(7);

const props = defineProps({
	title: String,
	description: String,
	labels: Array,
	datasets: Array,
	horizontal: Boolean,
	ordinate: Boolean,
	formatValue: Function,
	xLabel: String,
	yLabel: String,
});


const processedDatasets = computed(() => {
	const data = props.datasets;
	data.map(d => {
		d.backgroundColor = context => {
			const { ctx, chartArea } = context.chart;
			if (!chartArea) return null;
			return transparentGradientBar(
				ctx,
				chartArea,
				Array.isArray(d.borderColor) ? d.borderColor[context.dataIndex] : d.borderColor,
				props.horizontal
			);
		};
	});
	return data;
});

const draw = () => {
	chart = new Chart(id, {
		type: "bar",
		data: {
			datasets: processedDatasets.value,
			labels: props.labels,
		},
		options: {
			indexAxis: props.horizontal ? 'y' : 'x',
			responsive: true,
			maintainAspectRatio: false,
			maxBarThickness: 50,
			datasets: {
				bar: {
					borderWidth: props.horizontal ? { right: 2 } : { top: 2 },
					barPercentage: 1,
					categoryPercentage: .6,
				}
			},
			plugins: {
				tooltip: {
					displayColors: true,
					intersect: true,
					position: 'nearest',
					callbacks: {
						label: context => {
							const value = props.formatValue
								? props.formatValue(context.parsed[props.horizontal ? 'x' : 'y'])
								: context.formattedValue;
							return ' ' + value + ' ' + context.dataset.label;
						},
						labelColor: context => {
							return {
								borderWidth: 2,
								borderColor: context.dataset.borderColor,
								backgroundColor: context.dataset.borderColor + '33',
							};
						}
					}
				}
			},
			scales: {
				x: {
					title: {
						display: Boolean(props.xLabel),
						text: props.xLabel,
					},
					border: {
						display: false,
					},
					stacked: false,
					grid: {
						display: false,
						drawBorder: false,
					},
					ticks: {
						maxRotation: 0,
						padding: props.horizontal ? 0 : 10,
						precision: props.formatValue ? undefined : 0,
						callback: props.horizontal && props.formatValue ? value => props.formatValue(value) : undefined,
					},
					beginAtZero: true,
				},
				y: {
					title: {
						display: Boolean(props.yLabel),
						text: props.yLabel,
					},
					border: {
						display: false,
					},
					display: props.horizontal || props.ordinate,
					stacked: false,
					grid: {
						display: false,
						drawBorder: false,
					},
					ticks: {
						maxRotation: 0,
						padding: props.horizontal ? 0 : 10,
						autoSkipPadding: 0,
						precision: props.formatValue ? undefined : 0,
						callback: props.horizontal
							? value => props.labels[value] ?? value
							: (props.formatValue ? value => props.formatValue(value) : undefined),
					},
					beginAtZero: true,
				}
			}
		}
	});
};

onMounted(() => {
	if (props.labels && props.datasets) {
		draw();
	}
});

// update chart if data changes in an animatable way
watch(
	() => props.datasets,
	() => {
		chart.data.labels = props.labels;
		chart.data.datasets = processedDatasets.value;
		chart.update();
	}
);

// update chart if ordinate display changes
watch(
	() => props.ordinate,
	(newValue) => {
		chart.options.scales.y.display = props.horizontal || newValue;
		chart.update();
	}
);
</script>

<style>
.chart {
	display: flex;
	flex-flow: column;

	> h2,
	> p {
		flex: 0 1 auto;
	}
	> .chart-container {
		position: relative;
		flex: 1 1 auto;
	}
}
</style>
