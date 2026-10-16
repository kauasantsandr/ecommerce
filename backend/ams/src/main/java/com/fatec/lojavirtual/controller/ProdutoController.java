package com.fatec.ams.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fatec.ams.model.Produto;
import com.fatec.ams.repository.ProdutoRepository;

@RestController
@CrossOrigin(origins = "*")
public class ProdutoController {
    @Autowired
    ProdutoRepository bd;

    @PostMapping(value = "/api/produto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> gravar(
            @RequestParam("nome") String nome,
            @RequestParam("descritivo") String descritivo,
            @RequestParam("valor") double valor,
            @RequestParam("valorPromo") double valorPromo,
            @RequestParam("quantidade") int quantidade,
            @RequestParam("destaque") int destaque,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem) {

        if (nome == null || nome.isBlank()) {
            Map<String, Object> body = new HashMap<>();
            body.put("mensagem", "Nome do produto é obrigatório.");
            return ResponseEntity.badRequest().body(body);
        }

        Produto obj = new Produto();
        obj.setNome(nome.trim());
        obj.setDescritivo(descritivo == null ? "" : descritivo.trim());
        obj.setValor(valor);
        obj.setValorPromo(valorPromo);
        obj.setQuantidade(quantidade);
        obj.setDestaque(destaque);

        if (imagem != null && !imagem.isEmpty()) {
            try {
                Path pastaUpload = Paths.get("uploads");
                Files.createDirectories(pastaUpload);

                String extensao = "";
                String nomeOriginal = imagem.getOriginalFilename();
                if (nomeOriginal != null && nomeOriginal.contains(".")) {
                    extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf('.') + 1);
                }
                if (extensao == null || extensao.isBlank()) {
                    extensao = "png";
                }

                String nomeArquivo = UUID.randomUUID() + "." + extensao;
                Path destino = pastaUpload.resolve(nomeArquivo);
                Files.copy(imagem.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
                obj.setImagem("/uploads/" + nomeArquivo);
            } catch (Exception e) {
                Map<String, Object> body = new HashMap<>();
                body.put("mensagem", "Não foi possível salvar a imagem do produto.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
            }
        }

        Produto salvo = bd.save(obj);
        Map<String, Object> body = new HashMap<>();
        body.put("mensagem", "Produto cadastrado com sucesso!");
        body.put("produto", salvo);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/api/produto")
    public ResponseEntity<Map<String, Object>> alterar(@RequestBody Produto obj) {
        if (obj == null || obj.getCodigo() <= 0) {
            Map<String, Object> body = new HashMap<>();
            body.put("mensagem", "Código do produto inválido.");
            return ResponseEntity.badRequest().body(body);
        }

        Produto salvo = bd.save(obj);
        Map<String, Object> body = new HashMap<>();
        body.put("mensagem", "Produto atualizado com sucesso!");
        body.put("produto", salvo);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/api/produto/{codigo}")
    public Produto carregar(@PathVariable("codigo") int id) {
        if(bd.existsById(id)){
            return bd.findById(id).get();
        } else {
            return new Produto();
        }
    }

    @DeleteMapping("/api/produto/{codigo}")
    public void remover(@PathVariable("codigo") int id) {
        if(bd.existsById(id)){
            bd.deleteById(id);
        }
    }

    @GetMapping("/api/produtos")
    public List<Produto> listar() {
        return bd.findAll();
    }

    @GetMapping("/api/produto/vitrine")
    public List<Produto> retornaLista() {
        return bd.carregarVitrine();
    }

    @GetMapping("/api/produto/busca/{termo}")
    public List<Produto> retornaBusca(@PathVariable("termo") String busca) {
        return bd.carregarPesquisa("%" + busca.toLowerCase() + "%");
    }
}
