package streaming;

public class ImmoMessage {
    private float price;
    private String address;
    private String description;

    public ImmoMessage(float price, String address, String description) {
        this.price = price;
        this.address = address;
        this.description = description;
    }

    public float getPrice() {
        return price;
    }

    public String getAddress() {
        return address;
    }

    public String getDescription() {
        return description;
    }
}
