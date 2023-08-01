const { app, Tray, Menu,BrowserWindow } = require('electron')
const path = require('path')

const os = require('os');


let cpus = null

let m=null
let c=null
let tray = null
let newWindow=null
let iconIndex = 0;
let timer;
const getCPUInfo =()=>{
	cpus = os.cpus();
	let user = 0, nice = 0, sys = 0, idle = 0, irq = 0, total = 0;
	// 遍历 CPU
	for (const cpu in cpus) {
		const times = cpus[cpu].times;
		user += times.user;
		nice += times.nice;
		sys += times.sys;
		idle += times.idle;
		irq += times.irq;
	}
	total += user + nice + sys + idle + irq;
	return {
		idle,
		total,
	};
}
const getInterval= (m)=>{
	if (m>80){
		return 900
	}
	if (m>70){
		return 600
	}
	if (m>50){
		return  300
	}
	return  100
}
app.whenReady().then(() => {
	app.dock.setIcon(path.join(__dirname, 'imgs', 'icon.png'))
	app.dock.hide()
	const p =path.join(__dirname, 'imgs', 'frame_0.png')
	// 创建系统托盘
	tray = new Tray(p)
	// 创建上下文菜单
	const contextMenu = Menu.buildFromTemplate([
		{ label: '💗赞赏作者💗', click:  showWin },
		{ label: '😭退出😭', click: () => app.quit() }
	])
	tray.setContextMenu(contextMenu)
	setInfo()
	// 获取并更新监控信息
	setInterval(() => {
		setInfo()
	}, 2000)
	// 隐藏任务栏图标
	setInterval(() => {
		//更新m
		setIcon();
	}, 2000);

})
const setInfo=()=>{
	const{total,idle} = getCPUInfo()
	const usage = (1 - idle / total) * 100;
	c=usage.toFixed(2)
	m=((1 - os.freemem() / total)*100).toFixed(2)
	// 计算帧间隔时间
	const monitorInfo = `Cat Running:C:${c}% M:${m}%`
	tray.setToolTip(monitorInfo)

	// tray.setTitle(monitorInfo)
}
const setIcon = ()=>{
	clearInterval(timer); // 清除上一次的定时器
	let interval = getInterval(m)
	timer= setInterval(() => {
		iconIndex++;
		if(iconIndex > 6){
			iconIndex = 0;
		}
		let iconPath = path.join(__dirname, 'imgs', `frame_${iconIndex}.png`);
		tray.setImage(iconPath);
	}, interval);
}
const showWin=()=>{
	 newWindow = new BrowserWindow({
		width: 700,
		height: 700,
		 resizable:false,
		 maximizable:false
	});

	newWindow.loadFile(path.join(__dirname, `index.html`)).then()
	// 处理新窗口关闭事件
	newWindow.on('closed', () => {

	});
}

// 在所有窗口关闭后退出应用
app.on('window-all-closed', () => {
	// 禁止默认的退出行为
})
