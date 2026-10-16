package com.fatec.ams.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fatec.ams.model.Produto;
import com.fatec.ams.repository.ProdutoRepository;

@RestController
@CrossOrigin(origins = "*")
public class ProdutoController {
    @Autowired
    ProdutoRepository bd;

    @PostMapping("/api/produto")
    public ResponseEntity<Map<String, Object>> gravar(@RequestBody Produto obj) {
        if (obj == null || obj.getNome() == null || obj.getNome().isBlank()) {
            Map<String, Object> body = new HashMap<>();
            body.put("mensagem", "Nome do produto é obrigatório.");
            return ResponseEntity.badRequest().body(body);
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
