package com.crossapplication.main.repository.repo;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.crossapplication.main.entity.User;
import com.crossapplication.main.repository.interfaces.UserRepositoryInterface;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Repository
public class UserRepository implements UserRepositoryInterface{

    @PersistenceContext
    private EntityManager em;

    @Override
    public void deleteUser(int id) {
        User user = em.find(User.class, id);
        if (user != null) {
            em.remove(user);
        }
    }

    @Override
    public List<User> findAllUser() {
        String jpql = "SELECT u FROM User u";
        return em.createQuery(jpql, User.class).getResultList();
    }

    @Override
    public User findByEmail(String email) {
        String jpql = "SELECT u FROM User u WHERE u.email = :email";
        TypedQuery<User> query = em.createQuery(jpql, User.class);
        query.setParameter("email", email);

        List<User> result = query.getResultList();
        return result.isEmpty() ? null : result.get(0);
    }

    @Override
    public User findById(int id) {
        return em.find(User.class, id);
    }

    @Override
    public void save(User user) {
        if(user.getId() == null) {
            em.persist(user);
        } else {
            em.merge(user);
        }
    }

    @Override
    public void updateUser(User user) {
        em.merge(user);
    }
}
