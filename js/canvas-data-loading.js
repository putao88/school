/**
 *Author:wangy
 *Time:2017/7/17
 *Description:your words
 */
!function () {
    function LoadingCanvas(options) {
        let defaultOptions = {
            dom: "",
            canvasWidth: 255,
            canvasHeight: 255,
            innerRound: 30,
            baseColor: "#7AC0FC",
            highestColor: "#FEA81A",
            currentColor: "#6503ff",
            isHighest: true,
            isCurrent: true,
            isAnimation: true,
            value: {
                current: 10,
                highest: 10
            },
            url: "",
            percentWord: {
                content: "",
                position: {
                    x: 0,
                    y: 0,
                },
                style: "48px Arial",
                color: "#fff"
            },
            tipsWord: {
                content: "",
                position: {
                    x: 0,
                    y: 35,
                },
                style: "24px Arial",
                color: "#fff"
            },
            grads: {
                number: 100,
                ratio: 0.5,
                length: [22, 20]
            },
            gaps: {
                color: ["#2293F8"],
                length: [5, 5]
            },
        };
        options = options || {};
        this.options = LoadingCanvas.extent(options, defaultOptions);

        this.draw();
    }

    LoadingCanvas.prototype = {
        init: function () {
            if (!this.options.dom) {
                throw Error("请输入canvas元素");
            } else {
                this.options.dom = document.querySelector(this.options.dom);
            }
            if (this.options.dom["tagName"].search(/canvas/gi) === -1) {
                throw Error("请输入canvas元素");
            }
            if (!this.options.dom.getAttribute("width") || !this.options.dom.getAttribute("height")) {
                this.options.dom.width = this.options.canvasWidth;
                this.options.dom.height = this.options.canvasHeight;
            }

            this.xhr(this.options.url);
        },
        draw: function () {
            this.init();
            let dom = this.options.dom;
            let context = dom.getContext("2d");
            let that = this;
            //开始绘图
            context.translate(dom.width / 2, dom.height / 2);
            drawCurrentRound(this.options.value.current);

            function drawInnerRound() {
                context.save();
                context.beginPath();

                context.arc(0, 0, that.options.innerRound, 0, 2 * Math.PI, false);
                context.fillStyle = that.options.baseColor;
                context.fill();

                context.closePath();
                context.restore();
            }

            function drawTipsText() {
                context.save();
                context.beginPath();

                context.font = that.options.tipsWord.style;
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillStyle = that.options.tipsWord.color;

                context.fillText(that.options.tipsWord.content, that.options.tipsWord.position.x, that.options.tipsWord.position.y);

                context.closePath();
                context.restore();
            }

            function drawPercentText(currentNum) {
                currentNum > that.options.value.current ? currentNum = that.options.value.current : "";
                context.save();
                context.beginPath();

                context.font = that.options.percentWord.style;
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillStyle = that.options.percentWord.color;
                context.fillText(currentNum + "%", that.options.percentWord.position.x, that.options.percentWord.position.y);

                context.closePath();
                context.restore();
            }

            function drawGap(index) {
                context.save();
                context.beginPath();

                context.arc(0, 0, that.options.innerRound + that.options.gaps.length[index], 0, 2 * Math.PI, false);
                context.fillStyle = that.options.gaps.color[index];
                context.fill();

                context.closePath();
                context.restore();
            }

            function drawCurrentRound(num) {
                let count = that.options.isAnimation ? 0 : num, requestId;

                let draw = function (tempNum) {
                    context.clearRect(-1 / 2 * dom.width, -1 / 2 * dom.height, dom.width, dom.height);

                    drawBaseRound(that.options.grads.number, 0, that.options.baseColor);
                    drawBaseRound(that.options.grads.number, 1, that.options.baseColor);
                    drawGap(0);
                    drawInnerRound();
                    drawPercentText(tempNum);
                    drawTipsText();

                    drawRoundCommon(tempNum, 1);
                    drawRoundCommon(tempNum, 0);

                    if (count++ < Math.max(num, that.options.value.highest)) {
                        requestId = requestAnimationFrame(draw.bind(this, count))
                    } else {
                        cancelAnimationFrame(requestId);
                    }
                };
                requestAnimationFrame(draw.bind(this, count))
            }

            function drawRoundCommon(tempNum, index, color) {
                if (arguments.length === 3) {
                    context.fillStyle = color;
                } else {
                    switch (index) {
                        case 0: {
                            tempNum > that.options.value.current ? tempNum = that.options.value.current : "";
                            break;
                        }
                        case 1: {
                            tempNum > that.options.value.highest ? tempNum = that.options.value.height : "";
                            break;
                        }
                        default:
                            break;
                    }
                    context.fillStyle = index === 0 ? that.options.currentColor : (index === 1 ? that.options.highestColor : "");
                }

                context.save();
                let r = that.options.innerRound, perAngle;
                for (let n = 0; n < index + 1; n++) {
                    r += (that.options.gaps.length[n] + that.options.grads.length[n]);
                }

                perAngle = 2 * Math.PI / that.options.grads.number;

                context.beginPath();
                for (let n = 0; n < tempNum; n++) {
                    context.moveTo(-r * Math.sin(n * perAngle), r * Math.cos(n * perAngle));
                    context.lineTo(-r * Math.sin(n * perAngle + that.options.grads.ratio * perAngle), r * Math.cos(n * perAngle + that.options.grads.ratio * perAngle));
                    context.lineTo(-(r - that.options.grads.length[index]) * Math.sin(n * perAngle + that.options.grads.ratio * perAngle), (r - that.options.grads.length[index]) * Math.cos(n * perAngle + that.options.grads.ratio * perAngle));
                    context.lineTo(-(r - that.options.grads.length[index]) * Math.sin(n * perAngle), (r - that.options.grads.length[index]) * Math.cos(n * perAngle))
                }

                context.fill();
                context.closePath();

                context.restore();
            }

            function drawBaseRound(num, index, color) {
                drawRoundCommon(num, index, color)
            }
        },
        xhr: function (url) {
            let xhr = new XMLHttpRequest(), response, that = this;
            xhr.open("get", url, false);
            xhr.onload = function () {
                response = eval("(" + xhr.responseText + ")");
                that.options.value.current = response.current;
                that.options.value.highest = response.highest;
            };
            xhr.send(null);
        }
    };
    LoadingCanvas.extent = function (dest, source) {
        for (let i in source) {
            if (typeof source[i] !== 'object') {
                (typeof dest[i] === "undefined") ? dest[i] = source[i] : "";
            } else if (Object.prototype.toString.call(source[i]).search(/Array/) !== -1) {
                (typeof dest[i] === "undefined") ? dest[i] = [] : "";
                arguments.callee(dest[i], source[i]);
            } else if (Object.prototype.toString.call(source[i]).search(/Object/g) !== -1) {
                (typeof dest[i] === "undefined") ? dest[i] = {} : "";
                arguments.callee(dest[i], source[i]);
            }
        }
        return dest;
    };
    window.LoadingCanvas = LoadingCanvas;
}();