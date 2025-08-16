import { useEffect, useRef, type HTMLAttributes } from "react"
import { debouncing } from "../../Utils/Functions/clousers";


class Stars {
    x: number; y: number; size: number; speed: number;
    private color: string; private opacity: number;

    constructor(x: number, y: number, size: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.opacity = 0;
        this.speed = Math.random() * 1.5;
        this.color = '255,255,255';
    } 

    setColor(r: number, g: number, b: number) {
        this.color = `${r},${g},${b}`;
    }

    setOpacity(val: number) {
        if(val > 100) val = 100;
        if(val < 0) val = 0;
        this.opacity = val;
    }

    show(ctx: CanvasRenderingContext2D) {
        if(!ctx) return;

        ctx.fillStyle = `rgb(${this.color}, ${this.opacity / 100})`;

        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill()

    }

    update() {
        this.opacity += this.speed;

        if(this.opacity < 0 || this.opacity > 100) {
            this.opacity = this.opacity < 0 ? 0 : 100;
            this.speed *= -1;
        }
    }

    distanceFrom(x: number, y: number): number {
        const dx = x - this.x;
        const dy = y - this.y;
        return Math.sqrt(dx*dx + dy*dy);
    }
}

type Props = HTMLAttributes<HTMLCanvasElement> & {
    gap?: {x: number, y: number},
    mouseRadius?: number,
    stareSize?: number,
    stareColor?: [number, number, number]
}

export default function StarsBackground({gap={x: 20, y: 20}, mouseRadius=100,stareSize=2, stareColor=[50,250,200], ...props}: Props): React.JSX.Element {
    const canvas = useRef<HTMLCanvasElement>(null)
    const ctx = useRef<CanvasRenderingContext2D>(null);
    const rows = useRef(0);
    const cols = useRef(0);
    const stars = useRef<Stars[]>([]);
    

    function init() {
        if(!canvas.current) return;

        const {height, width} = canvas.current.getBoundingClientRect();
        canvas.current.width = width;
        canvas.current.height = height;

        rows.current = Math.round(height / gap?.y) + 1;
        cols.current = Math.round(width / gap?.x) + 1;

        stars.current = [];
        for(let y=0; y<rows.current; y++) {
            for(let x=0; x<cols.current; x++) {
                stars.current.push(new Stars(gap.x * x, gap.y * y, stareSize));
                stars.current.at(-1)?.setColor(...stareColor);
            }
        }
        
    }

    function draw() {
        requestAnimationFrame(draw);
        if(!canvas.current || !ctx.current) return 

        const {width, height} = canvas.current;
        ctx.current.clearRect(0, 0, width, height)
        
        ctx.current.fillStyle = Math.random() < .5 ? 'white' : 'black'
        for(let s of stars.current){ 
            s.show(ctx.current)
            s.update()
        }
    }

    function handleMouseMove(e: MouseEvent) {
        const {clientX: x, clientY: y} = e

        for(let s of stars.current) {
            const dis = s.distanceFrom(x, y);
            if(dis < mouseRadius && Math.random() < 0.02) 
                s.setOpacity(0);
        }
    }


    
    useEffect(() => {
        if(!canvas.current) return;
        ctx.current = canvas.current.getContext('2d');
        init();     

        canvas.current.addEventListener('mousemove', handleMouseMove);
        return () => canvas.current?.removeEventListener('mousemove', handleMouseMove)
    }, [canvas])
    
    useEffect(() => {
        const handleResize = debouncing(init);
        const drawloop = requestAnimationFrame(draw)
        window.addEventListener('resize', handleResize);

        
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(drawloop);
        }
    }, [])

    return <canvas ref={canvas} {...props} ></canvas>
}