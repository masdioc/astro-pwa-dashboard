export interface Pengadaan {
  kanreg_id: string;
  kanreg_nama: string;
  instansi_id?: string;
  instansi_nama?: string;
  jumlah_usulan?: number;
  berkas_terverifikasi?: number;
  approval_usulan?: number;
  perbaikan_dokumen?: number;
  tidak_memenuhi_syarat?: number;
  validasi_usulan_perbaikan_dokumen?: number;
  validasi_usulan_disetujui?: number;
  menunggu_ttd_pertek?: number;
  ttd_pertek?: number;
  menunggu_ttd_sk?: number;
  ttd_sk?: number;
  sk_berhasil?: number;
  approval_usulan_perbaikan_dokumen?: number;
}
