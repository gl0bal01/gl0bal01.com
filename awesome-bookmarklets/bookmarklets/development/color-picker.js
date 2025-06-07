/*!
 * Bookmarklet: Color Picker Tool
 * Description: Interactive color picker that extracts colors from any webpage element
 * Version: 1.0.0
 * Author: Your Name
 * Category: development
 * Tags: color, design, css, developer-tools, eyedropper
 * Compatibility: all-browsers
 * Last Updated: 2025-05-31
 */

/**
 * COLOR PICKER BOOKMARKLET
 * 
 * Features:
 * - Click any element to extract its color
 * - Shows RGB, HEX, and HSL values
 * - Copies color values to clipboard
 * - Visual crosshair cursor
 * - Color history panel
 * - Background and text color detection
 * - Escape key to exit
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        version: '1.0.0',
        name: 'Color Picker Tool',
        maxHistory: 10
    };
    
    // State
    let isActive = false;
    let colorHistory = [];
    let originalCursor = document.body.style.cursor;
    let panel = null;
    
    // Check if already running
    if (window.colorPickerActive) {
        alert('Color Picker is already running! Press ESC to exit.');
        return;
    }
    
    /**
     * Convert RGB to HEX
     */
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    /**
     * Convert RGB to HSL
     */
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }
    
    /**
     * Parse color string to RGB values
     */
    function parseColor(colorStr) {
        if (!colorStr || colorStr === 'transparent') return null;
        
        // Create a temporary element to get computed color
        const div = document.createElement('div');
        div.style.color = colorStr;
        document.body.appendChild(div);
        
        const computedColor = window.getComputedStyle(div).color;
        document.body.removeChild(div);
        
        // Parse rgb() or rgba() format
        const match = computedColor.match(/rgba?\(([^)]+)\)/);
        if (match) {
            const values = match[1].split(',').map(v => parseInt(v.trim()));
            return {
                r: values[0] || 0,
                g: values[1] || 0,
                b: values[2] || 0,
                a: values[3] !== undefined ? parseFloat(values[3]) : 1
            };
        }
        
        return null;
    }
    
    /**
     * Get element colors
     */
    function getElementColors(element) {
        const styles = window.getComputedStyle(element);
        const bgColor = parseColor(styles.backgroundColor);
        const textColor = parseColor(styles.color);
        const borderColor = parseColor(styles.borderColor);
        
        return { bgColor, textColor, borderColor };
    }
    
    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Copied to clipboard: ' + text);
            }).catch(() => {
                fallbackCopyToClipboard(text);
            });
        } else {
            fallbackCopyToClipboard(text);
        }
    }
    
    /**
     * Fallback copy method
     */
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('Copied to clipboard: ' + text);
        } catch (err) {
            showNotification('Failed to copy to clipboard');
        }
        
        document.body.removeChild(textArea);
    }
    
    /**
     * Show notification
     */
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50px;
            right: 20px;
            background: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10002;
            font-family: sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }
    
    /**
     * Add color to history
     */
    function addToHistory(colorData) {
        // Avoid duplicates
        const exists = colorHistory.some(item => 
            item.hex === colorData.hex && item.type === colorData.type
        );
        
        if (!exists) {
            colorHistory.unshift(colorData);
            if (colorHistory.length > CONFIG.maxHistory) {
                colorHistory.pop();
            }
            updatePanel();
        }
    }
    
    /**
     * Create control panel
     */
    function createPanel() {
        panel = document.createElement('div');
        panel.id = 'color-picker-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 300px;
            max-height: 400px;
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 12px;
            overflow: hidden;
        `;
        
        panel.innerHTML = `
            <div style="background: #333; color: white; padding: 10px; font-weight: bold;">
                🎨 ${CONFIG.name} v${CONFIG.version}
                <button id="close-color-picker" style="float: right; background: #ff4444; color: white; border: none; border-radius: 3px; padding: 2px 6px; cursor: pointer;">✕</button>
            </div>
            <div style="padding: 15px;">
                <div style="margin-bottom: 15px; text-align: center; color: #666;">
                    Click on any element to pick its color<br>
                    <small>Press ESC to exit</small>
                </div>
                <div id="color-info" style="display: none; margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px;">
                    <div id="color-preview" style="width: 100%; height: 40px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #ddd;"></div>
                    <div id="color-values"></div>
                </div>
                <div id="color-history-section" style="display: none;">
                    <h4 style="margin: 0 0 10px 0; color: #333;">Color History</h4>
                    <div id="color-history" style="max-height: 200px; overflow-y: auto;"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Close button event
        document.getElementById('close-color-picker').addEventListener('click', deactivateColorPicker);
        
        return panel;
    }
    
    /**
     * Update panel with color information
     */
    function updatePanel() {
        if (!panel) return;
        
        const historySection = document.getElementById('color-history-section');
        const historyContainer = document.getElementById('color-history');
        
        if (colorHistory.length > 0) {
            historySection.style.display = 'block';
            historyContainer.innerHTML = colorHistory.map(item => `
                <div style="display: flex; align-items: center; margin-bottom: 5px; padding: 5px; background: white; border-radius: 3px; border: 1px solid #eee;">
                    <div style="width: 20px; height: 20px; background: ${item.hex}; border-radius: 3px; border: 1px solid #ddd; margin-right: 8px; flex-shrink: 0;"></div>
                    <div style="flex-grow: 1; min-width: 0;">
                        <div style="font-weight: bold; color: #333;">${item.hex}</div>
                        <div style="font-size: 10px; color: #666;">${item.type} • ${item.element}</div>
                    </div>
                    <button onclick="navigator.clipboard&&navigator.clipboard.writeText('${item.hex}')" style="background: #007cba; color: white; border: none; border-radius: 3px; padding: 2px 6px; cursor: pointer; font-size: 10px;">Copy</button>
                </div>
            `).join('');
        } else {
            historySection.style.display = 'none';
        }
    }
    
    /**
     * Show color information
     */
    function showColorInfo(colors, element) {
        const colorInfo = document.getElementById('color-info');
        const colorPreview = document.getElementById('color-preview');
        const colorValues = document.getElementById('color-values');
        
        let primaryColor = colors.bgColor || colors.textColor;
        if (!primaryColor) return;
        
        const hex = rgbToHex(primaryColor.r, primaryColor.g, primaryColor.b);
        const hsl = rgbToHsl(primaryColor.r, primaryColor.g, primaryColor.b);
        
        colorPreview.style.background = `rgb(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b})`;
        
        const elementName = element.tagName.toLowerCase() + 
            (element.id ? '#' + element.id : '') + 
            (element.className ? '.' + element.className.split(' ')[0] : '');
        
        colorValues.innerHTML = `
            <div style="margin-bottom: 8px;">
                <strong>Element:</strong> ${elementName}<br>
                <strong>Color Type:</strong> ${colors.bgColor ? 'Background' : 'Text'}
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-family: monospace;">
                <div>
                    <strong>HEX:</strong><br>
                    <span style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px; cursor: pointer;" onclick="copyToClipboard('${hex}')">${hex}</span>
                </div>
                <div>
                    <strong>RGB:</strong><br>
                    <span style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px; cursor: pointer;" onclick="copyToClipboard('rgb(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b})')">rgb(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b})</span>
                </div>
                <div style="grid-column: 1 / -1;">
                    <strong>HSL:</strong><br>
                    <span style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px; cursor: pointer;" onclick="copyToClipboard('hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)')">hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)</span>
                </div>
            </div>
        `;
        
        colorInfo.style.display = 'block';
        
        // Add to history
        addToHistory({
            hex: hex,
            rgb: `rgb(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b})`,
            hsl: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`,
            type: colors.bgColor ? 'Background' : 'Text',
            element: elementName
        });
    }
    
    /**
     * Handle element click
     */
    function handleElementClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const element = event.target;
        const colors = getElementColors(element);
        
        if (colors.bgColor || colors.textColor) {
            showColorInfo(colors, element);
        }
    }
    
    /**
     * Handle mouse move for crosshair effect
     */
    function handleMouseMove(event) {
        // Optional: Add crosshair lines or element highlighting here
    }
    
    /**
     * Handle escape key
     */
    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            deactivateColorPicker();
        }
    }
    
    /**
     * Activate color picker mode
     */
    function activateColorPicker() {
        if (isActive) return;
        
        isActive = true;
        window.colorPickerActive = true;
        
        // Create panel
        createPanel();
        
        // Change cursor
        document.body.style.cursor = 'crosshair';
        
        // Add event listeners
        document.addEventListener('click', handleElementClick, true);
        document.addEventListener('mousemove', handleMouseMove, true);
        document.addEventListener('keydown', handleKeyDown, true);
        
        // Inject styles for animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        console.log(`${CONFIG.name} v${CONFIG.version} activated!`);
    }
    
    /**
     * Deactivate color picker mode
     */
    function deactivateColorPicker() {
        if (!isActive) return;
        
        isActive = false;
        window.colorPickerActive = false;
        
        // Restore cursor
        document.body.style.cursor = originalCursor;
        
        // Remove event listeners
        document.removeEventListener('click', handleElementClick, true);
        document.removeEventListener('mousemove', handleMouseMove, true);
        document.removeEventListener('keydown', handleKeyDown, true);
        
        // Remove panel
        if (panel) {
            panel.remove();
            panel = null;
        }
        
        console.log(`${CONFIG.name} deactivated.`);
    }
    
    // Make copyToClipboard globally accessible for inline onclick events
    window.copyToClipboard = copyToClipboard;
    
    // Start the color picker
    activateColorPicker();
    
})();

/* 
BOOKMARKLET CODE (copy this entire line for bookmark URL):
javascript:(function(){if(window.colorPickerActive){alert('Color Picker is already running! Press ESC to exit.');return;}const CONFIG={version:'1.0.0',name:'Color Picker Tool',maxHistory:10};let isActive=false,colorHistory=[],originalCursor=document.body.style.cursor,panel=null;function rgbToHex(r,g,b){return"#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}function rgbToHsl(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h,s,l=(max+min)/2;if(max===min){h=s=0;}else{const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}h/=6;}return[Math.round(h*360),Math.round(s*100),Math.round(l*100)];}function parseColor(colorStr){if(!colorStr||colorStr==='transparent')return null;const div=document.createElement('div');div.style.color=colorStr;document.body.appendChild(div);const computedColor=window.getComputedStyle(div).color;document.body.removeChild(div);const match=computedColor.match(/rgba?\(([^)]+)\)/);if(match){const values=match[1].split(',').map(v=>parseInt(v.trim()));return{r:values[0]||0,g:values[1]||0,b:values[2]||0,a:values[3]!==undefined?parseFloat(values[3]):1};}return null;}function getElementColors(element){const styles=window.getComputedStyle(element);const bgColor=parseColor(styles.backgroundColor);const textColor=parseColor(styles.color);const borderColor=parseColor(styles.borderColor);return{bgColor,textColor,borderColor};}function copyToClipboard(text){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(()=>{showNotification('Copied to clipboard: '+text);}).catch(()=>{fallbackCopyToClipboard(text);});}else{fallbackCopyToClipboard(text);}}function fallbackCopyToClipboard(text){const textArea=document.createElement('textarea');textArea.value=text;textArea.style.position='fixed';textArea.style.left='-999999px';textArea.style.top='-999999px';document.body.appendChild(textArea);textArea.focus();textArea.select();try{document.execCommand('copy');showNotification('Copied to clipboard: '+text);}catch(err){showNotification('Failed to copy to clipboard');}document.body.removeChild(textArea);}function showNotification(message){const notification=document.createElement('div');notification.style.cssText='position:fixed;top:50px;right:20px;background:#333;color:white;padding:10px 15px;border-radius:5px;z-index:10002;font-family:sans-serif;font-size:14px;box-shadow:0 4px 8px rgba(0,0,0,0.3);animation:slideIn 0.3s ease-out;';notification.textContent=message;document.body.appendChild(notification);setTimeout(()=>{notification.style.animation='slideOut 0.3s ease-in';setTimeout(()=>{if(notification.parentNode){notification.parentNode.removeChild(notification);}},300);},2000);}function addToHistory(colorData){const exists=colorHistory.some(item=>item.hex===colorData.hex&&item.type===colorData.type);if(!exists){colorHistory.unshift(colorData);if(colorHistory.length>CONFIG.maxHistory){colorHistory.pop();}updatePanel();}}function createPanel(){panel=document.createElement('div');panel.id='color-picker-panel';panel.style.cssText='position:fixed;top:20px;left:20px;width:300px;max-height:400px;background:white;border:2px solid #333;border-radius:8px;box-shadow:0 8px 16px rgba(0,0,0,0.3);z-index:10001;font-family:"Segoe UI",Tahoma,Geneva,Verdana,sans-serif;font-size:12px;overflow:hidden;';panel.innerHTML='<div style="background:#333;color:white;padding:10px;font-weight:bold;">🎨 '+CONFIG.name+' v'+CONFIG.version+'<button id="close-color-picker" style="float:right;background:#ff4444;color:white;border:none;border-radius:3px;padding:2px 6px;cursor:pointer;">✕</button></div><div style="padding:15px;"><div style="margin-bottom:15px;text-align:center;color:#666;">Click on any element to pick its color<br><small>Press ESC to exit</small></div><div id="color-info" style="display:none;margin-bottom:15px;padding:10px;background:#f5f5f5;border-radius:5px;"><div id="color-preview" style="width:100%;height:40px;border-radius:4px;margin-bottom:8px;border:1px solid #ddd;"></div><div id="color-values"></div></div><div id="color-history-section" style="display:none;"><h4 style="margin:0 0 10px 0;color:#333;">Color History</h4><div id="color-history" style="max-height:200px;overflow-y:auto;"></div></div></div>';document.body.appendChild(panel);document.getElementById('close-color-picker').addEventListener('click',deactivateColorPicker);return panel;}function activateColorPicker(){if(isActive)return;isActive=true;window.colorPickerActive=true;createPanel();document.body.style.cursor='crosshair';document.addEventListener('click',handleElementClick,true);document.addEventListener('keydown',handleKeyDown,true);const style=document.createElement('style');style.textContent='@keyframes slideIn{from{transform:translateX(100%);opacity:0;}to{transform:translateX(0);opacity:1;}}@keyframes slideOut{from{transform:translateX(0);opacity:1;}to{transform:translateX(100%);opacity:0;}}';document.head.appendChild(style);console.log(CONFIG.name+' v'+CONFIG.version+' activated!');}function deactivateColorPicker(){if(!isActive)return;isActive=false;window.colorPickerActive=false;document.body.style.cursor=originalCursor;document.removeEventListener('click',handleElementClick,true);document.removeEventListener('keydown',handleKeyDown,true);if(panel){panel.remove();panel=null;}console.log(CONFIG.name+' deactivated.');}window.copyToClipboard=copyToClipboard;activateColorPicker();})();
*/