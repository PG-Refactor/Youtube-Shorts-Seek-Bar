(() => {
    class ProgressBar {
        private video: HTMLMediaElement | null;
        private ytIconProgressBars: HTMLElement[];
        private progressBars: HTMLProgressElement[];
        private currentProgressBar: HTMLProgressElement | null;


        constructor(rootElementName: string) {
            this.video = this.getVideo();
            [this.ytIconProgressBars, this.progressBars] = this.create(rootElementName);
            this.currentProgressBar = null;
        }

        private getVideo = () => {
            const videos = document.querySelectorAll('video');
            let video = null;
            for (let i = 0; i < videos.length; i++) {
                if (videos[i].hasAttribute('src')) {
                    video = videos[i];
                    break;
                }
            }

            return video;
        }

        private create = (rootElementName: string): [HTMLElement[], HTMLProgressElement[]] => {
            const roots = document.querySelectorAll(rootElementName);
            let progressBars: HTMLProgressElement[] = [];
            let ytIconProgressBars: HTMLElement[] = [];
            for (let i = 0; i < roots.length; i++) {
                let progressBar = document.createElement('progress');
                if (!isNaN(this.video?.duration!))
                    progressBar.max = this.video?.duration!;
                progressBar.value = 0;
                progressBar.classList.add('youtube-short-extension-progress-bar');
                // progressBar.addEventListener('click', this.progressBarClickEvent);
                progressBar.addEventListener('mousedown', this.progressBarClickEvent);
                progressBars.push(progressBar);
                let ytIconProgressBar = document.createElement('yt-icon-progress-bar');
                ytIconProgressBar.classList.add('style-scope');
                ytIconProgressBar.classList.add('ytd-shorts-player-controls"');
                ytIconProgressBars.push(ytIconProgressBar);
                ytIconProgressBar.appendChild(progressBar);
                roots[i].appendChild(ytIconProgressBar);
            }

            return [ytIconProgressBars, progressBars];
        }

        private updateVideoTime = (time: number) => {
            if (this.video !== null)
                this.video.currentTime = time;
        }

        private progressBarClickEvent = (e: MouseEvent) => {
            e.preventDefault();
            this.currentProgressBar = e.currentTarget as HTMLProgressElement;
            this.updateVideoTimeAndProgressBar(e);
            document.addEventListener('mousemove', this.updateVideoTimeAndProgressBar);
            document.addEventListener('mouseup', (e: MouseEvent) => {
                e.preventDefault();
                document.removeEventListener('mousemove', this.updateVideoTimeAndProgressBar);
                this.currentProgressBar?.addEventListener('mousedown', this.progressBarClickEvent);
            }, { once: true });
        };

        private updateVideoTimeAndProgressBar = (e: MouseEvent) => {
            if (this.video !== null) {
                e.preventDefault();
                let ratio = (e.clientX - this.currentProgressBar?.getBoundingClientRect().x!) / this.currentProgressBar?.clientWidth!;
                if (ratio < 0)
                    ratio = 0;
                else if (ratio > 1)
                    ratio = 1;

                const value = this.video.duration * ratio;
                this.updateVideoTime(value);
                this.updateProgressBar();
            }
        };
        
        public remove = () => {
            for (let i = 0; i < this.ytIconProgressBars.length; i++)
                this.ytIconProgressBars[i].remove();
        }

        public updateProgressBar = () => {
            const value = this.video?.currentTime!;
            if (!isNaN(value)) {
                for (let i = 0; i < this.progressBars.length; i++)
                    this.progressBars[i].value = value;
            }
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
            const rootElementName = 'ytd-shorts-player-controls';
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