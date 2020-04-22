let game = {
    lib: {},
    ctx: null,
    audio: null,
    res: {
        total: 4,
        loaded: 0,
        sounds: {
            bullet: 'bullet.mp3',
            explosion: 'explosion.mp3'
        },
        images: {
            plane: 'plane.png',
            explosion: 'explosion.png',
            bullet:'bullet.png'
        }
    },
    data: {
        id:null,
        circle: 0,
        particles: null,
        plane: null,
        bulletSystem:null,
        recordKeys: {
            left: false,
            top: false,
            right: false,
            bottom: false,
            space: false
        }
    }
}

game.lib.BulletSystem = class{
    constructor(){
        this.bullet = [];
    }

    update(){
        if(this.bullet.length < 5){
            this.bullet.push(new game.lib.Bullet());
        }
        for(let i =0;i<this.bullet.length;i++){
            let die = this.bullet[i].update();

            if(die){
                this.bullet.splice(i,1);
                i--;
            }
        }
    }

    render(){
        for(let i =0;i<this.bullet.length;i++){
            this.bullet[i].render();
        }
    }
}

game.lib.Bullet = class{
    constructor(){
        this.size = 10;
        this.choice = Math.floor(Math.random() * 4);    

        if(this.choice == 0){
            this.x = Math.floor(Math.random() * game.ctx.canvas.width);
            this.y = 0;
        } else if(this.choice == 1){
            this.x = Math.floor(Math.random() * game.ctx.canvas.width);;
            this.y = game.ctx.canvas.height;
        }else if(this.choice == 2){
            this.x = 0;
            this.y = Math.floor(Math.random() * game.ctx.canvas.height);
        }else if(this.choice == 3){
            this.x = game.ctx.canvas.width;
            this.y = Math.floor(Math.random() * game.ctx.canvas.height);
        }
    }

    update(){
        if(this.choice == 0){
            this.y += Math.floor(Math.random() * 3);
        }else if(this.choice == 1){
            this.y -= Math.floor(Math.random() * 3);
        }else if(this.choice == 2){
            this.x += Math.floor(Math.random() * 3);
        }else{
            this.x -= Math.floor(Math.random() * 3);
        }

        if(this.y >= 150 || this.x > 300 || this.x < 0 || this.y < 0){
            return true;
        }
    }

    render(){
        game.ctx.drawImage(
            game.res.images.bullet,
            this.x,this.y,
            this.size,this.size
        )
    }
}

game.lib.Plane = class {
    constructor() {
        this.x = game.ctx.canvas.width / 2;
        this.y = game.ctx.canvas.height / 2;
        this.size = 20;
    }

    update() {
        let speed = 1;
        let key = game.data.recordKeys;

        if (key.space) {
            speed = 2;
        }

        if (key.left) {
            this.x -= speed;
        }

        if (key.right) {
            // game.ctx.rotate(5);
            this.x += speed;
        }

        if (key.top) {
            this.y -= speed;
        }

        if (key.bottom) {
            this.y += speed;
        }

        if (this.x <= 0 + this.size) {
            this.x = 0 + this.size;
        }

        if (this.y <= 0 + this.size) {
            this.y = 0 + this.size;
        }

        if (this.x + this.size >= game.ctx.canvas.width) {
            this.x = game.ctx.canvas.width - this.size;
        }

        if (this.y + this.size >= game.ctx.canvas.height) {
            this.y = game.ctx.canvas.height - this.size;
        }

        return false;
    }

    render() {
        game.ctx.save();
        game.ctx.drawImage(
            game.res.images.plane,
            this.x - this.size / 2, this.y - this.size / 2,
            this.size, this.size
        )

        if (game.data.recordKeys.space) {
            game.ctx.drawImage(
                game.res.images.explosion,
                this.x - (this.size / 2), this.y + (this.size / 2),
                this.size, this.size
            );
        }

        game.ctx.restore();
    }
}