package streaming;

public class Avg {
    private float sum;
    private int count;

    public Avg() {
        this.sum = 0;
        this.count = 0;
    }

    public Avg(float sum, int count) {
        this.sum = sum;
        this.count = count;
    }

    public float getSum() {
        return sum;
    }

    public int getCount() {
        return count;
    }

    public void add(float value) {
        this.sum += value;
        this.count++;
    }

    public float getAvg() {
        return this.sum / this.count;
    }
}
