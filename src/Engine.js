export default class Engine {

    constructor(parentElement, width = 1000, height = 750) {
        if(!(parentElement instanceof HTMLElement)) {
            throw "Bad parameter to engine. HTMLElement expected";
        }

        this.canvas = document.createElement("canvas");
        this.canvas.height = height;
        this.canvas.width = width;
        parentElement.prepend(this.canvas);
        this.ctx = this.canvas.getContext("2d");
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawLine(xStart, yStart, xEnd, yEnd, color = "black", width = 1) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(xStart, yStart);
        this.ctx.lineTo(xEnd, yEnd);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawStrokeRectangle(x, y, width, height, color = "black") {
        this.ctx.save();
        this.ctx.strokeStyle = color;        
        this.ctx.strokeRect(x, y, width, height);
        this.ctx.restore();
    }

    drawFillRectangle(x, y, width, height, color = "black") {
        this.ctx.save();
        this.ctx.strokeStyle = color;        
        this.ctx.fillStyle = color;
        this.ctx.strokeRect(x, y, width, height);
        this.ctx.restore();
    }

    drawStrokeCircle(xCenter, yCenter, radius, color = "black", startAngle = 0, endAngle = 360) {
        this.ctx.save();
        this.ctx.strokeStyle = color;   
        this.ctx.beginPath();
        this.ctx.arc(xCenter, yCenter, radius, (Math.PI/180) * startAngle, (Math.PI/180) * endAngle);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawFillCircle(xCenter, yCenter, radius, color = "black", width = 1, startAngle = 0, endAngle = 360) {
        this.ctx.save();
        this.ctx.strokeStyle = color;   
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.arc(xCenter, yCenter, radius, (Math.PI/180) * startAngle, (Math.PI/180) * endAngle);
        this.ctx.fill();
        this.ctx.restore();
    }

    putText(text, x, y, font = 32, color = "black") {
        this.ctx.save();
        this.ctx.font = font + 'px serif';
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }

    putDraw(src, x, y) {
        let img = new Image();
        img.src = src;
        img.onload = () => {
            this.ctx.drawImage(img, x, y);
        }
    }
}