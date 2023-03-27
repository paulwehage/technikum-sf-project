# Backend

- **In which case would you choose an AOT approacht and in which case would you
  use a JIT approach?**

Das das Backend in Node.js implementiert wurde, stellt sich diese Frage nicht.

Würde man z.B. Java verwenden hätten beide Ansätze verschiedene Vor- und
Nachteile. Sollte das Backend "serverless" deployt werden (z.B. Lambda oder
Cloud Functions) sollte AOT gewählt werden, da der Startup Speed deutlich höher
ist. Wenn das Backend länglebiger deployt ist (z.B. Kubernetes) hat JIT den
Vorteil, dass der Ablauf mit der Zeit optimiert wird und somit ein höherer Peak
Throughput und kürzere Latenz erreicht werden kann.

![Quelle: https://www.cesarsotovalero.net/blog/aot-vs-jit-compilation-in-java.html](https://www.cesarsotovalero.net/assets/resized/aot_vs_jit-1920x1179.jpeg)
