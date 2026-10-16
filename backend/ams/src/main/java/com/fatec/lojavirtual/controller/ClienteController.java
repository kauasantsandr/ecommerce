package com.fatec.ams.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

import com.fatec.ams.model.Cliente;
import com.fatec.ams.repository.ClienteRepository;
import com.fatec.ams.service.JwtUtil;

@RestController
@CrossOrigin(origins = "*")
public class ClienteController {
    @Autowired
    private ClienteRepository bd;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/api/cliente")
    public ResponseEntity<Map<String, Object>> gravar(@RequestBody Cliente obj) {
        if (obj == null || obj.getUsuario() == null || obj.getEmail() == null || obj.getSenha() == null) {
            Map<String, Object> body = new HashMap<>();
            body.put("mensagem", "Usuário, e-mail e senha são obrigatórios.");
            return ResponseEntity.badRequest().body(body);
        }

        if (bd.findByUsuario(obj.getUsuario().trim()).isPresent()) {
            Map<String, Object> body = new HashMap<>();
            body.put("mensagem", "Nome de usuário já cadastrado.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
        }

        if (bd.findByEmail(obj.getEmail().trim()).isPresent()) {
            Map<String, Object> body = new HashMap<>();
            body.put("mensagem", "E-mail já cadastrado.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
        }

        obj.setUsuario(obj.getUsuario().trim());
        obj.setEmail(obj.getEmail().trim().toLowerCase());
        obj.setRole(obj.getEmail().equalsIgnoreCase("admin@loja.com") || obj.getUsuario().equalsIgnoreCase("adminloja") ? "ADMIN" : "USER");
        Cliente salvo = bd.save(obj);

        String token = jwtUtil.generateToken(salvo.getEmail(), salvo.getUsuario());

        Map<String, Object> body = new HashMap<>();
        body.put("mensagem", "Cadastro realizado com sucesso!");
        body.put("token", token);
        body.put("cliente", salvo);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @GetMapping("/api/cliente/{id}")
    public Cliente carregar(@PathVariable("id") int codigo) {
        if (bd.existsById(codigo)) {
            return bd.findById(codigo).get();
        } else {
            return new Cliente();
        }
    }

    @GetMapping("/api/clientes")
    public List<Cliente> listar() {
        return bd.findAll();
    }

    @PutMapping("/api/cliente")
    public void alterar(@RequestBody Cliente obj) {
        if (bd.existsById(obj.getCodigo())) {
            bd.save(obj);
        }
    }

    @DeleteMapping("/api/cliente/{id}")
    public void remover(@PathVariable("id") int codigo) {
        bd.deleteById(codigo);
    }

    @PostMapping("/api/cliente/login")
    public ResponseEntity<Map<String, Object>> fazerLogin(@RequestBody Cliente obj) {
        if (obj == null || obj.getEmail() == null || obj.getSenha() == null) {
            Map<String, Object> body = new HashMap<>();
            body.put("mensagem", "E-mail e senha são obrigatórios.");
            return ResponseEntity.badRequest().body(body);
        }

        Optional<Cliente> op = bd.fazerLogin(obj.getEmail().trim().toLowerCase(), obj.getSenha());
        if (op.isPresent()) {
            Cliente cliente = op.get();
            String token = jwtUtil.generateToken(cliente.getEmail(), cliente.getUsuario());

            Map<String, Object> body = new HashMap<>();
            body.put("token", token);
            body.put("cliente", cliente);
            return ResponseEntity.ok(body);
        }

        Map<String, Object> body = new HashMap<>();
        body.put("mensagem", "Credenciais inválidas.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }
}
