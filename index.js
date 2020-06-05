const Ant = require("ant-plus");
const ws281x = require("rpi-ws281x-v2")
const stick = new Ant.GarminStick2();
const sensor = new Ant.HeartRateSensor(stick);
const bicyclePowerSensor = new Ant.BicyclePowerSensor(stick);
// PowerZone
const Zone1 = 160;
const Zone2 = 210;
const Zone3 = 250;
const Zone4 = 300;
const Zone5 = 350;

let count = 0;

class Light {

        constructor() {
                this.config = {};
                this.config.leds = 8; // ChangeLEDs
                this.config.dma = 5;
                this.config.brightness = 100;
                this.config.gpio = 12; // Change GPIO
                this.config.strip = 'grb';
                ws281x.configure(this.config);
        }

        run(str) {
                var pixels = new Uint32Array(this.config.leds);
                let red, green, blue;
                switch (str){
                        case "red": red = 255; break;
                        case "orange": red = 255; green = 165; break;
                        case "yellow": red = 255; green = 255; break;
                        case "green": green = 255; break;
                        case "blue": blue = 255; break;
                        case "off": red = 0; green = 0; blue = 0; break;
                }
                var color = (red << 16) | (green << 8)| blue;

                for (var i = 0; i < this.config.leds; i++)
                        pixels[i] = color;

                // Render to strip
                ws281x.render(pixels);
        }

};

var light = new Light();
bicyclePowerSensor.on("powerData", function(data) { 
                count += 1;
                var num;
                num = data.Power;
                if(num < Zone1){
                        light.run("blue");
                }else if(Zone1 <= num && num < Zone2){
                        light.run("green")
                }else if(Zone2 <= num && num < Zone3){
                        light.run("yellow")
                }else if(Zone3 <= num && num < Zone4){
                        light.run("orange")
                }else if(Zone5 <= num){
                        light.run("red")
                }

                console.log(count, data.DeviceID, num);
                });

stick.on("startup", function() {
                console.log("on start up");
                bicyclePowerSensor.attach(0, 0);
                });
async function main() {
        if (!stick.open()) {
                console.log("Stick not found!");
                return;
        }
}
main();


