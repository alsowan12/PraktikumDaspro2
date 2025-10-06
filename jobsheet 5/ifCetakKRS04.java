import java.util.Scanner;
public class ifCetakKRS04 { 
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.println("--- Cetak KRS ---");
        System.out.print("Apakah UKT sudah lunas? (true/false): ");
        
        boolean uktLunas = input.nextBoolean(); // nama variabel benar

        if (uktLunas) { // gunakan nama yang sama persis
            System.out.println("Pembayaran UKT terverifikasi");
            System.out.println("Silakan cetak KRS dan minta tanda tangan DPA");
        } else {
            System.out.println("Silakan lunasi UKT terlebih dahulu agar bisa mencetak KRS.");
        }

        input.close(); // opsional, untuk menutup Scanner
    }
}
