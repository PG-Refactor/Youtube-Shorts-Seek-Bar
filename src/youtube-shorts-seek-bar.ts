(() => {
    class ProgressBar {
        private video: HTMLMediaElement | null;
        private progressBar: HTMLProgressElement;


        constructor(beforeElementName: string) {
            this.video = this.getVideo();
            this.progressBar = this.create(beforeElementName);
        }

        private getVideo = () => {
            const videos = document.querySelectorAll('video');
            let video: HTMLMediaElement | null  = null;
            for (let i = 0; i < videos.length; i++) {
                if (videos[i].hasAttribute('src')) {
                    video = videos[i];
                    break;
                }
            }

            return video;
        }

        private create = (beforeElementName: string): HTMLProgressElement => {
            const beforeElement = document.querySelector(beforeElementName);
            let progressBar = document.createElement('progress');
            if (!isNaN(this.video?.duration!))
                progressBar.max = this.video?.duration!;
            progressBar.value = 0;
            progressBar.classList.add('youtube-shorts-extension-progress-bar');
            let ytIconProgressBar = document.createElement('yt-icon-progress-bar');
            ytIconProgressBar.classList.add('style-scope');
            ytIconProgressBar.classList.add('ytd-shorts-player-controls"');
            ytIconProgressBar.addEventListener('mousedown', this.progressBarClickEvent);
            ytIconProgressBar.appendChild(progressBar);
            beforeElement?.after(ytIconProgressBar);

            return progressBar;
        }

        private updateVideoTime = (time: number) => {
            if (this.video !== null)
                this.video.currentTime = time;
        }

        private progressBarClickEvent = (e: MouseEvent) => {
            e.preventDefault();
            const ytIconProgressBar = e.currentTarget as HTMLElement;
            this.updateVideoTimeAndProgressBar(e);
            document.addEventListener('mousemove', this.updateVideoTimeAndProgressBar);
            document.addEventListener('mouseup', (e: MouseEvent) => {
                e.preventDefault();
                document.removeEventListener('mousemove', this.updateVideoTimeAndProgressBar);
                ytIconProgressBar?.addEventListener('mousedown', this.progressBarClickEvent);
            }, { once: true });
        };

        private updateVideoTimeAndProgressBar = (e: MouseEvent) => {
            if (this.video !== null) {
                e.preventDefault();
                let ratio = (e.clientX - this.progressBar?.getBoundingClientRect().x!) / this.progressBar?.clientWidth!;
                if (ratio < 0)
                    ratio = 0;
                else if (ratio > 1)
                    ratio = 1;

                const value = this.video.duration * ratio;
                this.updateVideoTime(value);
                this.updateProgressBar();
            }
        };

        public updateProgressBar = () => {
            const value = this.video?.currentTime!;
            if (!isNaN(value))
                this.progressBar.value = value;
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
        
        if (url.indexOf('https://www.youtube.com/shorts') === 0) {
            const beforeElementName = '#play-pause-button-shape';
            const progressBar = new ProgressBar(beforeElementName);
            
            const interval = setInterval(() => {
                progressBar.updateProgressBar();
                if (location.href.indexOf('https://www.youtube.com/shorts') !== 0) {
                    clearInterval(interval);
                    if (document.visibilityState === 'visible')
                        sleep(1, main);
                    else {
                        window.addEventListener('focus', () => {
                            sleep(1, main);
                        }, {once: true});
                    }
                }
                else if (document.querySelector('yt-icon-progress-bar') === null) {
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