package com.fatec.ams.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.fatec.ams.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

    @Query(value="select * from produto where destaque>0 order by destaque", nativeQuery = true)
    public List<Produto> carregarVitrine();  

    @Query(value="select * from produto where lower(nome) like :termo or lower(descritivo) like :termo", nativeQuery = true)
    public List<Produto> carregarPesquisa(String termo);


}
