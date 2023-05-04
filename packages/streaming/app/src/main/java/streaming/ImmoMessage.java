package streaming;

public class ImmoMessage {
    private float pricePerSquareMeter;
    private float area;
    private String address;
    private String description;

    public ImmoMessage(float pricePerSquareMeter, float area, String address, String description) {
        this.pricePerSquareMeter = pricePerSquareMeter;
        this.area = area;
        this.address = address;
        this.description = description;
    }

    public float getPricePerSquareMeter() {
        return pricePerSquareMeter;
    }

    public float getArea() {
        return area;
    }

    public String getAddress() {
        return address;
    }

    public String getDescription() {
        return description;
    }
}
