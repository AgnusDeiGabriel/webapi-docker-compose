namespace MonApi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public decimal Prix { get; set; }
    }
}