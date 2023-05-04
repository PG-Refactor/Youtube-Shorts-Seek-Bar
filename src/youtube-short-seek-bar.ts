(() => {
    class ProgressBar {
        private video: HTMLVideoElement | null;
        private ytIconProgressBars: HTMLElement[];
        private progressBars: HTMLProgressElement[];

        constructor(rootElementName: string) {
            this.video = this.getVideo();
            [this.ytIconProgressBars, this.progressBars] = this.create(rootElementName);
        }

        getVideo() {
            const videos = document.querySelectorAll("video");
            let video = null;
            for (let i = 0; i < videos.length; i++) {
                if (videos[i].hasAttribute("src")) {
                    video = videos[i];
                    break;
                }
            }

            return video;
        }

        create(rootElementName: string): [HTMLElement[], HTMLProgressElement[]] {
            const roots = document.querySelectorAll(rootElementName);
            let progressBars: HTMLProgressElement[] = [];
            let ytIconProgressBars: HTMLElement[] = [];
            for (let i = 0; i < roots.length; i++) {
                let progressBar = document.createElement("progress");
                progressBar.max = this.video?.duration!;
                progressBar.value = 0;
                progressBar.classList.add("youtube-short-extension-progress-bar");
                progressBars.push(progressBar);
                let ytIconProgressBar = document.createElement("yt-icon-progress-bar");
                ytIconProgressBar.classList.add("style-scope");
                ytIconProgressBar.classList.add("ytd-shorts-player-controls");
                ytIconProgressBars.push(ytIconProgressBar);
                ytIconProgressBar.appendChild(progressBar);
                roots[i].appendChild(ytIconProgressBar);
            }

            return [ytIconProgressBars, progressBars];
        }

        remove() {
            for (let i = 0; i < this.ytIconProgressBars.length; i++)
                this.ytIconProgressBars[i].remove();
        }

        updateProgressBar() {
            let value = this.video?.currentTime!;
            for (let i = 0; i < this.progressBars.length; i++)
                this.progressBars[i].value = value;
        }

        updateVideoTime() {
            if (this.video !== null)
                this.video.currentTime = this.progressBars[0].value;
        }
    };
    
    const sleep = (second: number, callbackFunc: (arg?: any) => void, arg: any = null) => {
        let elapsedTime = 0;

        const interval = setInterval(() => {
            elapsedTime++;
            if (elapsedTime >= second) {
                clearInterval(interval);
                if (callbackFunc) {
                    if (arg === null)
                        callbackFunc();
                    else
                        callbackFunc(arg);
                }
            }
        }, 1000);

    };

    const main = () => {
        const url = location.href;
        if (location.href.indexOf('https://www.youtube.com/shorts') === 0) {
            const rootElementName = "ytd-shorts-player-controls";
            const progressBar = new ProgressBar(rootElementName);
            
            const interval = setInterval(() => {
                progressBar.updateProgressBar();
                if (url !== location.href) {
                    clearInterval(interval);
                    progressBar.remove();
                    if (document.visibilityState === 'visible')
                        sleep(1, main);
                    else {
                        window.addEventListener('focus', () => {
                            sleep(1, main);
                        }, {once: true});
                    }
                }
            }, 100);
        }
        else {
            const interval = setInterval(() => {
                if (url !== location.href) {
                    clearInterval(interval);
                    if (document.visibilityState === 'visible')
                        sleep(1, main);
                    else {
                        window.addEventListener('focus', () => {
                            sleep(1, main);
                        }, {once: true});
                    }
                }
            }, 100);
        }
    };


    if (document.visibilityState === 'visible')
        sleep(1, main);
    else {
        window.addEventListener('focus', () => {
            sleep(1, main);
        }, {once: true});
    }

})();