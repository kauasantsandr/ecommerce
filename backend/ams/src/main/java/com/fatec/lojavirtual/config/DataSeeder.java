package com.fatec.ams.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.fatec.ams.model.Cliente;
import com.fatec.ams.model.Produto;
import com.fatec.ams.repository.ClienteRepository;
import com.fatec.ams.repository.ProdutoRepository;

@Component
public class DataSeeder implements ApplicationRunner {

    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    public DataSeeder(ClienteRepository clienteRepository, ProdutoRepository produtoRepository) {
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (clienteRepository.findByEmail("admin@loja.com").isEmpty()) {
            Cliente admin = new Cliente();
            admin.setUsuario("adminloja");
            admin.setEmail("admin@loja.com");
            admin.setSenha("Admin@123");
            admin.setRole("ADMIN");
            clienteRepository.save(admin);
        }

        if (produtoRepository.count() == 0) {
            Produto lenovo = new Produto();
            lenovo.setNome("Notebook Lenovo");
            lenovo.setDescritivo("Notebook Lenovo com desempenho para trabalho, estudo e produtividade.");
            lenovo.setValor(4999.00);
            lenovo.setValorPromo(4299.00);
            lenovo.setQuantidade(10);
            lenovo.setDestaque(1);
            lenovo.setImagem("/uploads/lenovo.jpg");
            produtoRepository.save(lenovo);

            Produto wooting = new Produto();
            wooting.setNome("Teclado Wooting 80HE");
            wooting.setDescritivo("Teclado mecânico premium com switches analógicos e layout compacto.");
            wooting.setValor(5899.00);
            wooting.setValorPromo(5199.00);
            wooting.setQuantidade(8);
            wooting.setDestaque(1);
            wooting.setImagem("/uploads/wooting.jpg");
            produtoRepository.save(wooting);
        }
    }
}
